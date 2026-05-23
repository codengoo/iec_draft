/**
 * One-off migration: convert legacy AboutWithStats `heading` strings
 * to Lexical editor states.
 *
 * The block schema changed `heading` from `text` → `richText`.
 * Existing documents store `heading` either as:
 *   - a plain string (non-localized old shape)
 *   - { en: 'string', vi: 'string' } (localized, raw mongoose shape)
 *
 * This script walks Pages, Home, and their `_versions` shadow collections
 * via the raw mongoose driver (bypassing Payload validation), wraps each
 * string heading in a Lexical paragraph, and writes it back.
 *
 * Run with:  pnpm tsx scripts/migrate-about-heading-to-richtext.ts
 */

import 'dotenv/config'

import { getPayload } from 'payload'
import config from '@payload-config'

type LexicalState = {
  root: {
    type: 'root'
    format: ''
    indent: 0
    version: 1
    direction: 'ltr'
    children: Array<{
      type: 'paragraph'
      format: ''
      indent: 0
      version: 1
      direction: 'ltr'
      textFormat: 0
      textStyle: ''
      children: Array<{
        type: 'text'
        text: string
        format: 0
        style: ''
        mode: 'normal'
        detail: 0
        version: 1
      }>
    }>
  }
}

const stringToLexical = (text: string): LexicalState => ({
  root: {
    type: 'root',
    format: '',
    indent: 0,
    version: 1,
    direction: 'ltr',
    children: [
      {
        type: 'paragraph',
        format: '',
        indent: 0,
        version: 1,
        direction: 'ltr',
        textFormat: 0,
        textStyle: '',
        children: [
          {
            type: 'text',
            text,
            format: 0,
            style: '',
            mode: 'normal',
            detail: 0,
            version: 1,
          },
        ],
      },
    ],
  },
})

const isLexicalState = (v: unknown): boolean =>
  v != null && typeof v === 'object' && !Array.isArray(v) && 'root' in (v as Record<string, unknown>)

/**
 * Walks a value (any field or nested object/array) and converts any
 * AboutWithStats `heading` string it finds into a Lexical state.
 * Returns true if anything was changed.
 */
const migrateBlocks = (layout: unknown): boolean => {
  if (!Array.isArray(layout)) return false
  let changed = false
  for (const block of layout) {
    if (!block || typeof block !== 'object') continue
    const b = block as Record<string, unknown>
    if (b.blockType !== 'aboutWithStats') continue
    const heading = b.heading
    if (heading == null) continue
    if (typeof heading === 'string') {
      b.heading = stringToLexical(heading)
      changed = true
    } else if (typeof heading === 'object' && !isLexicalState(heading)) {
      // Localized shape: { en: 'string'|LexicalState, vi: ... }
      const localized = heading as Record<string, unknown>
      for (const locale of Object.keys(localized)) {
        const v = localized[locale]
        if (typeof v === 'string') {
          localized[locale] = stringToLexical(v)
          changed = true
        }
      }
    }
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

  // Targets: live + version shadow collections for Pages and Home.
  // Mongoose adapter naming patterns differ across versions, so match by prefix/suffix.
  // Note: globals are stored in the `globals` collection with a globalType discriminator.
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
    // Match any doc that has an aboutWithStats block in any layout-like array.
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

      // Live collections store blocks under `layout`.
      if (migrateBlocks((doc as Record<string, unknown>).layout)) changed = true

      // Versions collections wrap content under `version`.
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
