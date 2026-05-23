import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

export const revalidateHome: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating home global`)

    setImmediate(() => {
      revalidatePath('/', 'layout')
      revalidateTag('global_home', 'max')
    })
  }

  return doc
}
