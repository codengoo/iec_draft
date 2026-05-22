import { gcsStorage } from '@payloadcms/storage-gcs'
import { s3Storage } from '@payloadcms/storage-s3'
import type { StorageOptions } from '@google-cloud/storage'
import { readFileSync } from 'fs'
import type { Plugin } from 'payload'

type StorageProvider = 'local' | 'minio' | 'gcs'

const COLLECTIONS = { media: true } as const

const resolveProvider = (): StorageProvider => {
  const raw = (process.env.STORAGE_PROVIDER || 'local').toLowerCase()
  if (raw === 'local' || raw === 'minio' || raw === 'gcs') {
    return raw
  }
  // eslint-disable-next-line no-console
  console.warn(
    `[storage] Unknown STORAGE_PROVIDER="${raw}". Falling back to "local". Valid values: local | minio | gcs.`,
  )
  return 'local'
}

const buildMinio = (): Plugin => {
  const required = [
    'MINIO_BUCKET',
    'MINIO_ACCESS_KEY_ID',
    'MINIO_SECRET_ACCESS_KEY',
    'MINIO_ENDPOINT',
  ] as const
  const missing = required.filter((k) => !process.env[k])
  if (missing.length) {
    throw new Error(`[storage] STORAGE_PROVIDER=minio but missing env: ${missing.join(', ')}`)
  }
  return s3Storage({
    collections: COLLECTIONS,
    bucket: process.env.MINIO_BUCKET!,
    config: {
      credentials: {
        accessKeyId: process.env.MINIO_ACCESS_KEY_ID!,
        secretAccessKey: process.env.MINIO_SECRET_ACCESS_KEY!,
      },
      endpoint: process.env.MINIO_ENDPOINT!,
      region: process.env.MINIO_REGION || 'us-east-1',
      forcePathStyle: true,
    },
  })
}

// Loads a service-account JSON either from a file path (GCS_KEY_FILE) or an
// inline JSON string (GCS_CREDENTIALS). Inline takes priority so the same env
// var works in environments that don't support filesystem secrets.
const loadGcsCredentials = (): StorageOptions => {
  const inline = process.env.GCS_CREDENTIALS
  const keyFile = process.env.GCS_KEY_FILE
  const projectId = process.env.GCS_PROJECT_ID

  if (inline) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(inline)
    } catch {
      throw new Error(
        '[storage] GCS_CREDENTIALS must be a valid JSON string (service account key).',
      )
    }
    return {
      ...(projectId ? { projectId } : {}),
      credentials: parsed as StorageOptions['credentials'],
    }
  }

  if (keyFile) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(readFileSync(keyFile, 'utf8'))
    } catch (err) {
      throw new Error(
        `[storage] Failed to read GCS_KEY_FILE at "${keyFile}": ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }
    return {
      ...(projectId ? { projectId } : {}),
      credentials: parsed as StorageOptions['credentials'],
    }
  }

  // Fall through to Application Default Credentials (GOOGLE_APPLICATION_CREDENTIALS
  // or workload identity). projectId stays optional — GCS infers it from ADC.
  return projectId ? { projectId } : {}
}

const buildGcs = (): Plugin => {
  if (!process.env.GCS_BUCKET) {
    throw new Error('[storage] STORAGE_PROVIDER=gcs but missing env: GCS_BUCKET')
  }
  return gcsStorage({
    collections: COLLECTIONS,
    bucket: process.env.GCS_BUCKET,
    options: loadGcsCredentials(),
  })
}

export const storagePlugin = (): Plugin | null => {
  const provider = resolveProvider()
  switch (provider) {
    case 'minio':
      return buildMinio()
    case 'gcs':
      return buildGcs()
    case 'local':
    default:
      return null
  }
}
