import type { GlobalAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

export const revalidateGeneral: GlobalAfterChangeHook = () => {
  revalidatePath('/', 'layout')
}
