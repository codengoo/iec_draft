import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { CareersHighlightBlock as Props, Job, Media } from '@/payload-types'

import { CareersHighlightView } from './CareersHighlightView'

export const CareersHighlightBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  headingHighlight,
  description,
  heroImage,
  limit: limitFromProps,
  ctaLabel,
  ctaLink,
}) => {
  const limit = limitFromProps || 3
  const payload = await getPayload({ config: configPromise })

  // Try featured jobs first; if none exist, fall back to the most recent jobs
  // so the section never appears empty when there is data in the collection.
  const { docs: featuredDocs } = await payload.find({
    collection: 'jobs',
    where: { isFeatured: { equals: true } },
    sort: '-createdAt',
    limit,
    depth: 0,
  })

  let jobs = featuredDocs as Job[]
  if (jobs.length === 0) {
    const { docs: recentDocs } = await payload.find({
      collection: 'jobs',
      sort: '-createdAt',
      limit,
      depth: 0,
    })
    jobs = recentDocs as Job[]
  }

  const resolvedHeroImage =
    heroImage && typeof heroImage === 'object' ? (heroImage as Media) : null

  return (
    <CareersHighlightView
      eyebrow={eyebrow}
      heading={heading}
      headingHighlight={headingHighlight}
      description={description}
      ctaLabel={ctaLabel}
      ctaLink={ctaLink}
      heroImage={resolvedHeroImage}
      jobs={jobs}
    />
  )
}
