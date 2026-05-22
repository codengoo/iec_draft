/**
 * One-off migration: upload everything in public/media to MinIO.
 *
 * The Payload S3 storage adapter uses each Media doc's `filename` (and the
 * generated `imageSizes.*.filename`) as the bucket key. So this script just
 * mirrors the contents of public/media/ into the configured MinIO bucket
 * with identical keys. After it finishes you can flip STORAGE_PROVIDER=minio
 * and existing Media documents resolve to MinIO without any DB changes.
 *
 * Run with:  pnpm tsx scripts/migrate-media-to-minio.ts
 *
 * Required env (in .env):
 *   MINIO_ENDPOINT, MINIO_BUCKET, MINIO_ACCESS_KEY_ID, MINIO_SECRET_ACCESS_KEY
 *   MINIO_REGION (optional, defaults to us-east-1)
 */

import 'dotenv/config'

import {
  HeadObjectCommand,
  PutObjectCommand,
  S3Client,
  CreateBucketCommand,
  HeadBucketCommand,
} from '@aws-sdk/client-s3'
import { createReadStream, statSync } from 'fs'
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

const main = async (): Promise<void> => {
  const endpoint = requireEnv('MINIO_ENDPOINT')
  const bucket = requireEnv('MINIO_BUCKET')
  const accessKeyId = requireEnv('MINIO_ACCESS_KEY_ID')
  const secretAccessKey = requireEnv('MINIO_SECRET_ACCESS_KEY')
  const region = process.env.MINIO_REGION || 'us-east-1'

  const skipExisting = process.argv.includes('--skip-existing')
  const dryRun = process.argv.includes('--dry-run')

  const client = new S3Client({
    endpoint,
    region,
    forcePathStyle: true,
    credentials: { accessKeyId, secretAccessKey },
  })

  // Ensure bucket exists
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }))
  } catch {
    if (dryRun) {
      console.log(`[dry-run] Would create bucket "${bucket}"`)
    } else {
      console.log(`Bucket "${bucket}" not found — creating...`)
      await client.send(new CreateBucketCommand({ Bucket: bucket }))
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

    if (skipExisting) {
      try {
        await client.send(new HeadObjectCommand({ Bucket: bucket, Key: key }))
        skipped++
        console.log(`SKIP  ${key} (already exists)`)
        continue
      } catch {
        // not found → upload
      }
    }

    if (dryRun) {
      console.log(`[dry-run] PUT  ${key}  (${contentType})`)
      continue
    }

    try {
      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: createReadStream(fullPath),
          ContentType: contentType,
          ContentLength: statSync(fullPath).size,
        }),
      )
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
