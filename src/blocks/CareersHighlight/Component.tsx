import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { IconArrowRight } from '@tabler/icons-react'

import type { CareersHighlightBlock as Props, Job } from '@/payload-types'

import { CMSLink } from '@/components/Link'

export const CareersHighlightBlock: React.FC<Props & { id?: string }> = async ({
  heading,
  limit: limitFromProps,
  ctaLabel,
  ctaLink,
}) => {
  const limit = limitFromProps || 3
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'jobs',
    where: { isFeatured: { equals: true } },
    sort: '-createdAt',
    limit,
    depth: 0,
  })

  const jobs = docs as Job[]

  return (
    <section className="container">
      {heading && (
        <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl lg:text-4xl">
          {heading}
        </h2>
      )}

      {jobs.length > 0 && (
        <div className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col rounded-lg border border-border bg-card p-6 transition hover:shadow-md"
            >
              <div className="mb-4 inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                <IconArrowRight size={18} />
              </div>
              <h3 className="mb-2 text-lg font-semibold leading-tight">{job.title}</h3>
              {job.description && (
                <p className="mb-6 line-clamp-3 flex-1 text-sm text-muted-foreground">
                  {job.description}
                </p>
              )}
              <a
                href={`/careers/${job.id}`}
                className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
              >
                Apply Now <IconArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      )}

      {ctaLink && ctaLabel && (
        <div className="flex justify-center">
          <CMSLink {...ctaLink} label={ctaLabel} appearance="default" size="lg" />
        </div>
      )}
    </section>
  )
}
