import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Job } from '../../../payload-types'

export const revalidateJob: CollectionAfterChangeHook<Job> = ({
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const detailPath = `/career/${doc.id}`
    payload.logger.info(`Revalidating job at path: ${detailPath}`)
    setImmediate(() => {
      revalidatePath(detailPath)
      revalidatePath('/career')
    })
  }
  return doc
}

export const revalidateJobDelete: CollectionAfterDeleteHook<Job> = ({ doc, req: { context } }) => {
  if (!context.disableRevalidate) {
    setImmediate(() => {
      revalidatePath(`/career/${doc?.id}`)
      revalidatePath('/career')
    })
  }
  return doc
}
