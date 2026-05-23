import type { CollectionAfterChangeHook } from 'payload'

import type { Job } from '../../../payload-types'
import { sendCampaign } from '../../../utilities/email/sendCampaign'

export const notifyJobSubscribers: CollectionAfterChangeHook<Job> = async ({
  doc,
  previousDoc,
  req,
  operation,
}) => {
  // Only fire when transitioning to published for the first time
  const isNowPublished = doc._status === 'published'
  const wasAlreadyPublished = previousDoc?._status === 'published'

  // For create operations (no previousDoc), fire if published
  // For update operations, only fire on the publish transition
  if (!isNowPublished) return doc
  if (operation === 'update' && wasAlreadyPublished) return doc

  try {
    // Resolve localized title (prefer en, fallback to first string found)
    const rawTitle = doc.title
    const title =
      typeof rawTitle === 'string'
        ? rawTitle
        : (rawTitle as Record<string, string> | undefined)?.en ??
          Object.values(rawTitle as Record<string, string>)[0] ??
          String(doc.id)

    const campaign = await req.payload.create({
      collection: 'email-campaigns',
      data: {
        name: `[Auto] New Job: ${title}`,
        subject: `Cơ hội việc làm mới: {{job.title}}`,
        type: 'new_job',
        relatedJob: doc.id,
        status: 'draft',
      },
      overrideAccess: true,
      req,
    })

    await sendCampaign({ campaignId: String(campaign.id), req })
  } catch (error) {
    console.error('[notifyJobSubscribers] Failed to send campaign:', error)
    // Do not throw — must not block the Payload save operation
  }

  return doc
}
