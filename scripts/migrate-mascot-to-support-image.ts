/**
 * One-off migration: rename AboutWithStats `mascot` → `supportImage`.
 *
 * The block schema renamed the field; existing documents still store the
 * upload id under `mascot`. This script walks Pages, Home, and their
 * `_versions` shadow collections via the raw mongoose driver (bypassing
 * Payload validation), copies the value from `mascot` to `supportImage`,
 * and unsets `mascot`.
 *
 * Run with:  pnpm tsx scripts/migrate-mascot-to-support-image.ts
 */

import 'dotenv/config'

import { getPayload } from 'payload'
import config from '@payload-config'

const migrateBlocks = (layout: unknown): boolean => {
  if (!Array.isArray(layout)) return false
  let changed = false
  for (const block of layout) {
    if (!block || typeof block !== 'object') continue
    const b = block as Record<string, unknown>
    if (b.blockType !== 'aboutWithStats') continue
    if (!('mascot' in b)) continue
    if (b.mascot == null) {
      delete b.mascot
      continue
    }
    // Only copy if supportImage is not already set (avoid clobbering newer edits).
    if (b.supportImage == null) {
      b.supportImage = b.mascot
    }
    delete b.mascot
    changed = true
  }
  return changed
}

const run = async () => {
  const payload = await getPayload({ config })
  // The mongoose adapter exposes its connection here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conn = (payload.db as any).connection
  const db = conn.db

  const allCollections: { name: string }[] = await db.listCollections().toArray()
  const names = allCollections.map((c) => c.name)
  console.log('Collections in DB:', names.join(', '))

  const targetNames = names.filter(
    (n) =>
      n === 'pages' ||
      n === 'home' ||
      n === 'globals' ||
      n.startsWith('_pages_versions') ||
      n.startsWith('_home_versions') ||
      n === 'pages_versions' ||
      n === 'home_versions',
  )

  let totalChanged = 0
  for (const colName of targetNames) {
    const col = db.collection(colName)
    const cursor = col.find({
      $or: [
        { 'layout.blockType': 'aboutWithStats' },
        { 'version.layout.blockType': 'aboutWithStats' },
      ],
    })
    let docCount = 0
    let changedCount = 0
    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue
      docCount++
      let changed = false

      if (migrateBlocks((doc as Record<string, unknown>).layout)) changed = true

      const version = (doc as Record<string, unknown>).version
      if (version && typeof version === 'object') {
        if (migrateBlocks((version as Record<string, unknown>).layout)) changed = true
      }

      if (changed) {
        const set: Record<string, unknown> = {}
        if ((doc as Record<string, unknown>).layout)
          set.layout = (doc as Record<string, unknown>).layout
        if (version) set.version = version
        await col.updateOne({ _id: doc._id }, { $set: set })
        changedCount++
        totalChanged++
      }
    }
    console.log(`  ${colName}: scanned ${docCount}, migrated ${changedCount}`)
  }

  console.log(`Done. Total documents migrated: ${totalChanged}`)
  await conn.close()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
