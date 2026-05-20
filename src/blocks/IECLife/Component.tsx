import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { IECLifeBlock as Props, Post } from '@/payload-types'

import { Media } from '@/components/Media'

function formatPostDate(timestamp?: string | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const DD = String(date.getDate()).padStart(2, '0')
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const YYYY = date.getFullYear()
  return `${DD}.${MM}.${YYYY}`
}

export const IECLifeBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  ctaLabel,
  limit: limitFromProps,
}) => {
  const limit = limitFromProps || 5
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit,
    depth: 1,
  })

  const posts = docs as Post[]
  if (posts.length === 0) return null

  const [featured, ...rest] = posts

  return (
    <section className="container">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          {eyebrow && (
            <span className="block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {eyebrow}
            </span>
          )}
          {heading && (
            <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">{heading}</h2>
          )}
        </div>
        {ctaLabel && (
          <a
            href="/posts"
            className="text-sm font-medium text-primary hover:underline"
          >
            {ctaLabel} →
          </a>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {featured && (
          <a
            href={`/posts/${featured.slug}`}
            className="group block overflow-hidden rounded-lg border border-border bg-card"
          >
            {featured.heroImage && typeof featured.heroImage === 'object' && (
              <div className="aspect-[4/3] overflow-hidden bg-muted">
                <Media
                  resource={featured.heroImage}
                  imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="p-6">
              <p className="mb-2 text-xs text-muted-foreground">
                {formatPostDate(featured.publishedAt)}
              </p>
              <h3 className="text-xl font-bold leading-tight group-hover:text-primary">
                {featured.title}
              </h3>
            </div>
          </a>
        )}

        {rest.length > 0 && (
          <ul className="flex flex-col gap-4">
            {rest.map((post) => (
              <li key={post.id}>
                <a
                  href={`/posts/${post.slug}`}
                  className="group flex gap-4 rounded-lg border border-border bg-card p-3 transition hover:shadow-sm"
                >
                  {post.heroImage && typeof post.heroImage === 'object' && (
                    <div className="h-20 w-28 shrink-0 overflow-hidden rounded bg-muted">
                      <Media
                        resource={post.heroImage}
                        imgClassName="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="mb-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                      {formatPostDate(post.publishedAt)}
                    </p>
                    <h4 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
                      {post.title}
                    </h4>
                  </div>
                </a>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
