import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { JobBoardBlock as JobBoardBlockProps, Media, Social } from '@/payload-types'
import { JobBoardClient, type JobItem, type SocialItem } from './JobBoardClient'

export const JobBoardBlock: React.FC<JobBoardBlockProps & { id?: string }> = async ({
  heading,
  subtitle,
  noFitCard,
}) => {
  const payload = await getPayload({ config: configPromise })

  const [{ docs: jobDocs }, { docs: socialDocs }] = await Promise.all([
    payload.find({
      collection: 'jobs',
      limit: 200,
      depth: 0,
    }),
    payload.find({
      collection: 'social',
      limit: 20,
      depth: 0,
      sort: 'order',
    }),
  ])

  const jobs: JobItem[] = jobDocs.map((doc) => ({
    id: String(doc.id),
    title: doc.title,
    department: doc.department,
    location: doc.location,
    salaryLabel: doc.salaryLabel ?? null,
    linkedinUrl: doc.linkedinUrl ?? null,
    applyUrl: doc.applyUrl ?? null,
  }))

  const socials: SocialItem[] = (socialDocs as Social[]).map((doc) => ({
    id: String(doc.id),
    platform: doc.platform,
    url: doc.url,
  }))

  // Resolve avatar URLs
  const avatarUrls: string[] = []
  if (noFitCard?.innovatorAvatars?.length) {
    for (const item of noFitCard.innovatorAvatars) {
      if (item.avatar && typeof item.avatar === 'object') {
        const media = item.avatar as Media
        if (media.url) avatarUrls.push(media.url)
      }
    }
  }

  return (
    <JobBoardClient
      jobs={jobs}
      heading={heading}
      subtitle={subtitle}
      socials={socials}
      noFitCard={
        noFitCard
          ? {
              heading: noFitCard.heading ?? undefined,
              subtitle: noFitCard.subtitle ?? undefined,
              cvUrl: noFitCard.cvUrl ?? undefined,
              innovatorLabel: noFitCard.innovatorLabel ?? undefined,
              avatarUrls,
            }
          : undefined
      }
    />
  )
}
