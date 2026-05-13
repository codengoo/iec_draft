import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { JobBoardBlock as JobBoardBlockProps } from '@/payload-types'
import { JobBoardClient, type JobItem } from './JobBoardClient'

export const JobBoardBlock: React.FC<JobBoardBlockProps & { id?: string }> = async ({
  heading,
  subtitle,
}) => {
  const payload = await getPayload({ config: configPromise })

  const { docs: jobDocs } = await payload.find({
    collection: 'jobs',
    limit: 200,
    depth: 0,
  })

  const jobs: JobItem[] = jobDocs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    department: doc.department,
    location: doc.location,
    salaryLabel: doc.salaryLabel ?? null,
    linkedinUrl: doc.linkedinUrl ?? null,
    applyUrl: doc.applyUrl ?? null,
  }))

  return <JobBoardClient jobs={jobs} heading={heading} subtitle={subtitle} />
}
