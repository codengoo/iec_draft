import type { CollectionAfterChangeHook } from 'payload'
import { upsertSubscriber } from '@/utilities/email/upsertSubscriber'

export const syncSubscriber: CollectionAfterChangeHook = async ({ doc, operation, req }) => {
  if (operation !== 'create') return doc

  try {
    await upsertSubscriber({
      email: doc.email,
      name: doc.fullName,
      source: 'job_application',
      req,
    })
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[syncSubscriber] Failed to upsert subscriber:', err)
  }

  return doc
}
