import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateCareer: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating career global`)

    setImmediate(() => {
      revalidatePath('/career', 'layout')
      revalidateTag('global_career', 'max')
    })
  }

  return doc
}
