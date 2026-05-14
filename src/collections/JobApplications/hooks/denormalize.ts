import type { CollectionBeforeChangeHook } from 'payload'

import type { Job, JobApplication } from '../../../payload-types'

export const denormalizeJob: CollectionBeforeChangeHook<JobApplication> = async ({
  data,
  operation,
  req,
}) => {
  if (operation !== 'create') return data

  // Snapshot the position title at submission time, so it survives
  // job edits/renames/deletions and exports cleanly.
  if (data.job && !data.position) {
    try {
      const jobId = typeof data.job === 'object' ? data.job.id : data.job
      const job = (await req.payload.findByID({
        collection: 'jobs',
        id: jobId as string,
        depth: 0,
      })) as Job | null
      if (job) data.position = job.title
    } catch {
      // best-effort — leave position blank if job lookup fails
    }
  }

  if (!data.submittedAt) {
    data.submittedAt = new Date().toISOString()
  }

  return data
}
