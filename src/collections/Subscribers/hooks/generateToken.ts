import type { CollectionBeforeChangeHook } from 'payload'

export const generateSubscriberToken: CollectionBeforeChangeHook = ({ data, operation }) => {
  if (operation === 'create' && !data.unsubscribeToken) {
    data.unsubscribeToken = crypto.randomUUID()
  }
  if (operation === 'create' && !data.subscribedAt) {
    data.subscribedAt = new Date().toISOString()
  }
  return data
}
