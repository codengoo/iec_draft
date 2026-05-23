import type { Endpoint } from 'payload'

import { sendCampaign } from '../utilities/email/sendCampaign'

export const sendCampaignEndpoint: Endpoint = {
  method: 'post',
  path: '/email-campaigns/send',
  handler: async (req) => {
    // Auth check
    if (!req.user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    let body: { campaignId?: string }
    try {
      body = (await req.json?.()) as { campaignId?: string }
    } catch {
      return Response.json({ error: 'Invalid request body' }, { status: 400 })
    }

    const { campaignId } = body ?? {}

    if (!campaignId) {
      return Response.json({ error: 'campaignId is required' }, { status: 400 })
    }

    // Check campaign exists and is draft
    let campaign: { status?: string } | null = null
    try {
      campaign = (await req.payload.findByID({
        collection: 'email-campaigns',
        id: campaignId,
        overrideAccess: true,
      })) as { status?: string }
    } catch {
      return Response.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (!campaign) {
      return Response.json({ error: 'Campaign not found' }, { status: 404 })
    }

    if (campaign.status !== 'draft') {
      return Response.json({ error: 'Campaign already sent or currently sending' }, { status: 400 })
    }

    try {
      const result = await sendCampaign({ campaignId, req })
      return Response.json({ success: true, recipientCount: result.recipientCount }, { status: 200 })
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to send campaign'
      return Response.json({ error: message }, { status: 500 })
    }
  },
}
