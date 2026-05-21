import React from 'react'

import configPromise from '@payload-config'
import { IconArrowUpRight } from '@tabler/icons-react'
import Link from 'next/link'
import { getPayload } from 'payload'

import type { Category, IECLifeBlock as Props, Post, Tag } from '@/payload-types'

import { Media } from '@/components/Media'

function formatPostDate(timestamp?: string | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const DD = String(date.getDate()).padStart(2, '0')
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const YYYY = date.getFullYear()
  return `${DD}/${MM}/${YYYY}`
}

function getCategories(categories?: (string | Category)[] | null): Category[] {
  if (!Array.isArray(categories)) return []
  return categories.filter((c): c is Category => typeof c === 'object' && c !== null)
}

function getTags(tags?: (string | Tag)[] | null): Tag[] {
  if (!Array.isArray(tags)) return []
  return tags.filter((t): t is Tag => typeof t === 'object' && t !== null)
}

function extractPlainText(node: unknown, max: number = 220): string {
  if (!node || typeof node !== 'object') return ''
  const n = node as { text?: unknown; children?: unknown }
  let out = ''
  if (typeof n.text === 'string') out += n.text
  if (Array.isArray(n.children)) {
    for (const child of n.children) {
      if (out.length >= max) break
      out += (out && !out.endsWith(' ') ? ' ' : '') + extractPlainText(child, max - out.length)
    }
  }
  return out.length > max ? out.slice(0, max).trimEnd() + '…' : out
}

function getPostExcerpt(post: Post, max: number = 220): string {
  if (post.meta?.description) return post.meta.description
  const fromContent = extractPlainText(post.content?.root, max)
  return fromContent.trim()
}

const MetaLine: React.FC<{ categories: Category[]; date: string }> = ({ categories, date }) => {
  const hasCategories = categories.length > 0
  return (
    <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-muted-foreground md:text-xs">
      {hasCategories && (
        <>
          <span className="flex flex-wrap items-center gap-x-1.5 text-foreground/70">
            {categories.map((c, i) => (
              <React.Fragment key={c.id}>
                <span>{c.title}</span>
                {i < categories.length - 1 && <span className="text-muted-foreground/60">,</span>}
              </React.Fragment>
            ))}
          </span>
          <span aria-hidden className="text-muted-foreground/60">
            •
          </span>
        </>
      )}
      <span>{date}</span>
    </p>
  )
}

const HashtagList: React.FC<{ tags: Tag[]; size?: 'sm' | 'md' }> = ({ tags, size = 'md' }) => {
  if (tags.length === 0) return null
  const textSize = size === 'sm' ? 'text-[11px]' : 'text-xs md:text-[13px]'
  return (
    <p className={`mt-2 flex flex-wrap gap-x-2 gap-y-1 font-semibold text-primary ${textSize}`}>
      {tags.map((t) => (
        <span key={t.id}>#{t.title.replace(/\s+/g, '_')}</span>
      ))}
    </p>
  )
}

export const IECLifeBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  ctaLabel,
  limit: limitFromProps,
}) => {
  const limit = limitFromProps || 4
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
    <section className="relative overflow-hidden bg-[#FFF5F0] py-16 md:py-20 lg:py-24">
      {/* Soft pastel decorations */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-112 w-md rounded-full bg-rose-200/30 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-128 w-lg rounded-full bg-amber-100/40 blur-3xl"
      />

      <div className="container relative">
        {/* Header */}
        <header className="mb-10 flex flex-wrap items-end justify-between gap-4 md:mb-12">
          <div>
            {eyebrow && (
              <span className="mb-3 block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {heading && (
              <h2
                className="bg-clip-text text-4xl font-black uppercase leading-none tracking-tight text-transparent md:text-5xl lg:text-6xl"
                style={{
                  backgroundImage:
                    'linear-gradient(120deg, #006FEE 0%, #38BDF8 55%, #0EA5E9 100%)',
                  filter:
                    'drop-shadow(0 8px 18px rgba(0, 111, 238, 0.35)) drop-shadow(0 2px 4px rgba(56, 189, 248, 0.25))',
                }}
              >
                {heading}
              </h2>
            )}
          </div>

          {ctaLabel && (
            <Link
              href="/posts"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-10px_rgba(0,111,238,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(0,111,238,0.65)]"
            >
              <span>{ctaLabel}</span>
              <IconArrowUpRight
                className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                stroke={2.5}
              />
            </Link>
          )}
        </header>

        {/* Content grid */}
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:gap-10">
          {/* Featured */}
          {featured && (
            <Link
              href={`/posts/${featured.slug}`}
              className="group flex flex-col rounded-3xl bg-white p-3 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.25)] ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_40px_70px_-25px_rgba(0,0,0,0.3)] md:p-4"
            >
              {featured.heroImage && typeof featured.heroImage === 'object' && (
                <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
                  <Media
                    fill
                    resource={featured.heroImage}
                    imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
                    size="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col px-3 pb-3 pt-5 md:px-4 md:pb-4 md:pt-6">
                <MetaLine
                  categories={getCategories(featured.categories)}
                  date={formatPostDate(featured.publishedAt)}
                />
                <h3 className="mt-3 text-xl font-extrabold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary md:text-2xl">
                  {featured.title}
                </h3>
                {getPostExcerpt(featured) && (
                  <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:text-base">
                    {getPostExcerpt(featured)}
                  </p>
                )}
                <HashtagList tags={getTags(featured.tags)} />
              </div>
            </Link>
          )}

          {/* Side list */}
          {rest.length > 0 && (
            <ul className="flex flex-col">
              {rest.map((post, idx) => (
                <li
                  key={post.id}
                  className={idx > 0 ? 'border-t border-foreground/10 pt-5 md:pt-6' : ''}
                >
                  <Link
                    href={`/posts/${post.slug}`}
                    className={
                      'group flex gap-4 transition-all duration-300 hover:-translate-y-0.5 md:gap-5 ' +
                      (idx < rest.length - 1 ? 'pb-5 md:pb-6' : '')
                    }
                  >
                    {post.heroImage && typeof post.heroImage === 'object' && (
                      <div className="relative size-20 shrink-0 overflow-hidden rounded-2xl bg-muted shadow-[0_10px_25px_-15px_rgba(0,0,0,0.25)] md:size-24">
                        <Media
                          fill
                          resource={post.heroImage}
                          imgClassName="object-cover transition-transform duration-500 group-hover:scale-110"
                          size="(max-width: 768px) 80px, 96px"
                        />
                      </div>
                    )}
                    <div className="min-w-0 flex-1 self-center">
                      <MetaLine
                        categories={getCategories(post.categories)}
                        date={formatPostDate(post.publishedAt)}
                      />
                      <h4 className="mt-1.5 line-clamp-2 text-sm font-bold uppercase leading-snug text-foreground transition-colors duration-300 group-hover:text-primary md:text-base">
                        {post.title}
                      </h4>
                      {getPostExcerpt(post, 140) && (
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted-foreground md:text-sm">
                          {getPostExcerpt(post, 140)}
                        </p>
                      )}
                      <HashtagList tags={getTags(post.tags)} size="sm" />
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
