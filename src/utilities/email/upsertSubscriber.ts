import type { PayloadRequest } from 'payload'

type UpsertSubscriberArgs = {
  email: string
  name?: string
  source: 'job_application' | 'form_submission'
  req: PayloadRequest
}

export async function upsertSubscriber({ email, name, source, req }: UpsertSubscriberArgs): Promise<void> {
  const { payload } = req

  const existing = await payload.find({
    collection: 'subscribers',
    where: { email: { equals: email } },
    limit: 1,
    pagination: false,
  })

  if (existing.totalDocs > 0) {
    // Already exists — do not overwrite, especially do not re-subscribe
    // someone who has explicitly unsubscribed
    return
  }

  await payload.create({
    collection: 'subscribers',
    data: { email, name, source },
    req,
  })
}
