/**
 * One-off migration: upload everything in public/media to Google Cloud Storage.
 *
 * The Payload GCS storage adapter uses each Media doc's `filename` (and the
 * generated `imageSizes.*.filename`) as the object name. This script mirrors
 * public/media/ into the configured GCS bucket with identical keys. After it
 * finishes you can flip STORAGE_PROVIDER=gcs and existing Media documents
 * resolve to GCS without any DB changes.
 *
 * Run with:  pnpm tsx scripts/migrate-media-to-gcs.ts
 *
 * Required env (in .env):
 *   GCS_BUCKET
 *   GCS_PROJECT_ID (optional — inferred from credentials)
 *   Auth: GCS_KEY_FILE (path) OR GCS_CREDENTIALS (inline JSON) OR ADC
 *
 * Flags:
 *   --skip-existing   skip objects that already exist in the bucket
 *   --dry-run         list what would happen without uploading
 */

import 'dotenv/config'

import { Storage, type StorageOptions } from '@google-cloud/storage'
import { createReadStream, readFileSync, statSync } from 'fs'
import { readdir } from 'fs/promises'
import mime from 'mime-types'
import path from 'path'
import { fileURLToPath } from 'url'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const MEDIA_DIR = path.resolve(dirname, '../public/media')

const requireEnv = (name: string): string => {
  const value = process.env[name]
  if (!value) {
    throw new Error(`Missing required env: ${name}`)
  }
  return value
}

const buildClientOptions = (): StorageOptions => {
  const inline = process.env.GCS_CREDENTIALS
  const keyFile = process.env.GCS_KEY_FILE
  const projectId = process.env.GCS_PROJECT_ID

  if (inline) {
    let parsed: Record<string, unknown>
    try {
      parsed = JSON.parse(inline)
    } catch {
      throw new Error('GCS_CREDENTIALS must be a valid JSON string (service account key).')
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
        `Failed to read GCS_KEY_FILE at "${keyFile}": ${
          err instanceof Error ? err.message : String(err)
        }`,
      )
    }
    return {
      ...(projectId ? { projectId } : {}),
      credentials: parsed as StorageOptions['credentials'],
    }
  }

  return projectId ? { projectId } : {}
}

const main = async (): Promise<void> => {
  const bucketName = requireEnv('GCS_BUCKET')
  const skipExisting = process.argv.includes('--skip-existing')
  const dryRun = process.argv.includes('--dry-run')

  const storage = new Storage(buildClientOptions())
  const bucket = storage.bucket(bucketName)

  const [bucketExists] = await bucket.exists()
  if (!bucketExists) {
    if (dryRun) {
      console.log(`[dry-run] Would create bucket "${bucketName}"`)
    } else {
      console.log(`Bucket "${bucketName}" not found — creating...`)
      await bucket.create()
    }
  }

  let entries: string[]
  try {
    entries = await readdir(MEDIA_DIR)
  } catch {
    console.error(`No files to migrate: ${MEDIA_DIR} does not exist.`)
    return
  }

  const files = entries.filter((name) => {
    const full = path.join(MEDIA_DIR, name)
    try {
      return statSync(full).isFile()
    } catch {
      return false
    }
  })

  console.log(`Found ${files.length} files in ${MEDIA_DIR}`)
  if (dryRun) console.log('[dry-run] No uploads will be performed.')

  let uploaded = 0
  let skipped = 0
  let failed = 0

  for (const file of files) {
    const key = file
    const fullPath = path.join(MEDIA_DIR, file)
    const contentType = mime.lookup(file) || 'application/octet-stream'
    const object = bucket.file(key)

    if (skipExisting) {
      const [exists] = await object.exists()
      if (exists) {
        skipped++
        console.log(`SKIP  ${key} (already exists)`)
        continue
      }
    }

    if (dryRun) {
      console.log(`[dry-run] PUT  ${key}  (${contentType})`)
      continue
    }

    try {
      await new Promise<void>((resolve, reject) => {
        const writeStream = object.createWriteStream({
          resumable: false,
          metadata: { contentType },
        })
        writeStream.on('error', reject)
        writeStream.on('finish', resolve)
        createReadStream(fullPath).on('error', reject).pipe(writeStream)
      })
      uploaded++
      console.log(`PUT   ${key}`)
    } catch (err) {
      failed++
      console.error(`FAIL  ${key}:`, err instanceof Error ? err.message : err)
    }
  }

  console.log('\n--- Summary ---')
  console.log(`Uploaded: ${uploaded}`)
  console.log(`Skipped:  ${skipped}`)
  console.log(`Failed:   ${failed}`)
  console.log(`Total:    ${files.length}`)
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
