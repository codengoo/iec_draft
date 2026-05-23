import type { Endpoint } from 'payload'

export const unsubscribeEndpoint: Endpoint = {
  method: 'get',
  path: '/unsubscribe',
  handler: async (req) => {
    const token = new URL(req.url ?? '', 'http://localhost').searchParams.get('token')

    if (!token) {
      return Response.json({ error: 'Missing token' }, { status: 400 })
    }

    const result = await req.payload.find({
      collection: 'subscribers',
      where: { unsubscribeToken: { equals: token } },
      limit: 1,
      overrideAccess: true,
    })

    if (result.totalDocs === 0) {
      return Response.json({ error: 'Invalid or expired token' }, { status: 404 })
    }

    const subscriber = result.docs[0]

    if (!subscriber.subscribed) {
      return Response.json({ alreadyUnsubscribed: true }, { status: 200 })
    }

    await req.payload.update({
      collection: 'subscribers',
      id: subscriber.id,
      data: {
        subscribed: false,
        unsubscribedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    return Response.json({ success: true }, { status: 200 })
  },
}
