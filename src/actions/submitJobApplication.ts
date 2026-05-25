'use server'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

const ALLOWED_MIME_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
])
const MAX_FILE_BYTES = 10 * 1024 * 1024 // 10 MB

export type SubmitResult = { ok: true } | { ok: false; error: string; field?: string }

export async function submitJobApplication(formData: FormData): Promise<SubmitResult> {
  const rawJobId = String(formData.get('jobId') ?? '').trim()
  const fullName = String(formData.get('fullName') ?? '').trim()
  const email = String(formData.get('email') ?? '').trim()
  const phone = String(formData.get('phone') ?? '').trim()
  const experience = String(formData.get('experience') ?? '').trim()
  const positionInput = String(formData.get('position') ?? '').trim()
  const additionalLink = String(formData.get('additionalLink') ?? '').trim()
  const cv = formData.get('cv')

  const isGeneral = !rawJobId
  if (!isGeneral && !/^[a-f0-9]{24}$/i.test(rawJobId)) {
    return { ok: false, error: 'Invalid job reference.', field: 'jobId' }
  }
  if (fullName.length < 2) {
    return { ok: false, error: 'Full name is required.', field: 'fullName' }
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: 'Invalid email address.', field: 'email' }
  }
  if (phone.length < 6) {
    return { ok: false, error: 'Phone number is required.', field: 'phone' }
  }
  if (!(cv instanceof File) || cv.size === 0) {
    return { ok: false, error: 'Please attach your CV.', field: 'cv' }
  }
  if (cv.size > MAX_FILE_BYTES) {
    return { ok: false, error: 'CV file must be 10 MB or smaller.', field: 'cv' }
  }
  if (!ALLOWED_MIME_TYPES.has(cv.type)) {
    return { ok: false, error: 'CV must be a PDF or Word document.', field: 'cv' }
  }
  if (experience.length > 4000) {
    return {
      ok: false,
      error: 'Experience summary is too long (max 4000 characters).',
      field: 'experience',
    }
  }
  if (positionInput.length > 200) {
    return {
      ok: false,
      error: 'Position is too long (max 200 characters).',
      field: 'position',
    }
  }
  if (additionalLink.length > 0) {
    if (additionalLink.length > 500) {
      return {
        ok: false,
        error: 'Additional link is too long (max 500 characters).',
        field: 'additionalLink',
      }
    }
    if (!/^https?:\/\//i.test(additionalLink)) {
      return {
        ok: false,
        error: 'Additional link must be a valid URL (starting with http:// or https://).',
        field: 'additionalLink',
      }
    }
  }

  try {
    const payload = await getPayload({ config: configPromise })

    if (!isGeneral) {
      // Confirm the job exists before uploading anything
      const job = await payload.findByID({
        collection: 'jobs',
        id: rawJobId,
        depth: 0,
        overrideAccess: true,
      })
      if (!job) {
        return { ok: false, error: 'This job is no longer available.', field: 'jobId' }
      }
    }

    const buffer = Buffer.from(await cv.arrayBuffer())
    const safeName = sanitizeFilename(`${fullName} - CV - ${cv.name}`)

    const media = await payload.create({
      collection: 'media',
      data: { alt: `CV — ${fullName}` },
      file: {
        data: buffer,
        mimetype: cv.type,
        name: safeName,
        size: cv.size,
      },
      overrideAccess: true,
    })

    await payload.create({
      collection: 'job-applications',
      data: {
        job: isGeneral ? undefined : rawJobId,
        position: positionInput || (isGeneral ? 'General Application' : undefined),
        fullName,
        email,
        phone,
        experience: experience || undefined,
        additionalLink: additionalLink || undefined,
        cv: media.id,
        status: 'new',
      },
      overrideAccess: true,
    })

    return { ok: true }
  } catch (err) {
    console.error('[submitJobApplication]', err)
    return { ok: false, error: 'Something went wrong. Please try again.' }
  }
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^\w.\-() ]+/g, '_').slice(0, 180)
}
