'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

export type SubscribeResult = { ok: true } | { ok: false; error: string }

export async function subscribeNewsletter(formData: FormData): Promise<SubscribeResult> {
  const email = String(formData.get('email') ?? '')
    .trim()
    .toLowerCase()
  const name = String(formData.get('name') ?? '').trim()

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Invalid email address.' }
  }
  if (email.length > 254) {
    return { ok: false, error: 'Invalid email address.' }
  }
  if (name.length > 200) {
    return { ok: false, error: 'Name is too long.' }
  }

  const payload = await getPayload({ config: configPromise })

  try {
    await payload.create({
      collection: 'subscribers',
      data: {
        email,
        name: name || undefined,
        source: 'newsletter',
        subscribed: true,
        subscribedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })
    return { ok: true }
  } catch (err: unknown) {
    // Duplicate email — silently succeed so we don't leak subscriber info
    const msg = err instanceof Error ? err.message : String(err)
    if (msg.toLowerCase().includes('duplicate') || msg.toLowerCase().includes('unique')) {
      return { ok: true }
    }
    console.error('[subscribeNewsletter]', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}
