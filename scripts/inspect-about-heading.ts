/**
 * Debug: dump the stored AboutWithStats heading from the Home global
 * (and any Pages that use it) so we can see whether bold formatting
 * is actually saved in the Lexical state.
 */

import 'dotenv/config'
import { getPayload } from 'payload'
import config from '@payload-config'

const run = async () => {
  const payload = await getPayload({ config })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const conn = (payload.db as any).connection
  const db = conn.db

  const collections = ['globals', 'pages']
  for (const colName of collections) {
    const col = db.collection(colName)
    const cursor = col.find({ 'layout.blockType': 'aboutWithStats' })
    while (await cursor.hasNext()) {
      const doc = await cursor.next()
      if (!doc) continue
      const layout = (doc as Record<string, unknown>).layout
      if (!Array.isArray(layout)) continue
      for (const block of layout) {
        if (block?.blockType !== 'aboutWithStats') continue
        console.log('---')
        console.log(`Collection: ${colName} | Doc _id: ${doc._id}`)
        console.log('heading:', JSON.stringify(block.heading, null, 2))
      }
    }
  }

  await conn.close()
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
