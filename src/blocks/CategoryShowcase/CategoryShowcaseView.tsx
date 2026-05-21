'use client'

import { IconArrowRight, IconSparkles, IconStarFilled } from '@tabler/icons-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import type { Category, Post, Tag } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

/* ──────────── helpers ──────────── */

function formatPostDate(timestamp?: string | null): string {
  if (!timestamp) return ''
  const date = new Date(timestamp)
  const DD = String(date.getDate()).padStart(2, '0')
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const YYYY = date.getFullYear()
  return `${DD}/${MM}/${YYYY}`
}

function getTags(tags?: (string | Tag)[] | null): Tag[] {
  if (!Array.isArray(tags)) return []
  return tags.filter((t): t is Tag => typeof t === 'object' && t !== null)
}

function extractPlainText(node: unknown, max: number = 180): string {
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

function getPostExcerpt(post: Post, max: number = 180): string {
  if (post.meta?.description) {
    return post.meta.description.length > max
      ? post.meta.description.slice(0, max).trimEnd() + '…'
      : post.meta.description
  }
  return extractPlainText(post.content?.root, max).trim()
}

type SerializedDescription = NonNullable<React.ComponentProps<typeof RichText>['data']>

type Props = {
  eyebrow?: string | null
  heading: string
  description?: SerializedDescription | null
  ctaLabel?: string | null
  category: Category | null
  posts: Post[]
}

/* ──────────── motion variants ──────────── */

const container: Variants = {
  hidden: { opacity: 1 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.05 },
  },
}

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

/* ──────────── photo card ──────────── */

const PhotoCard: React.FC<{ post: Post; className?: string }> = ({ post, className = '' }) => {
  if (!post.heroImage || typeof post.heroImage !== 'object') return null
  const tags = getTags(post.tags).slice(0, 2)
  const date = formatPostDate(post.publishedAt)
  const excerpt = getPostExcerpt(post, 140)

  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group block rounded-3xl bg-white p-0 shadow-[0_8px_20px_-15px_rgba(0,0,0,0)] ring-1 ring-black/0 transition-all duration-500 ease-out hover:-translate-y-2 hover:p-2 hover:shadow-[0_30px_55px_-15px_rgba(0,0,0,0.32)] hover:ring-black/5 md:hover:p-2.5 ${className}`}
    >
      {/* Inner image frame — full bleed by default, pulls in to reveal white frame on hover */}
      <div className="relative h-full overflow-hidden rounded-3xl bg-muted transition-[border-radius] duration-500 group-hover:rounded-[1.25rem]">
        <Media
          fill
          resource={post.heroImage}
          imgClassName="object-cover transition-all duration-700 ease-out group-hover:scale-110 group-hover:-translate-y-1"
          size="(max-width: 768px) 100vw, 33vw"
        />

        {/* Persistent gradient — keeps text legible without hover */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/95 via-slate-900/55 to-slate-900/10 transition-opacity duration-500 group-hover:from-slate-900/95 group-hover:via-slate-900/70"
        />

        {/* Content overlay — always visible */}
        <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1.5 p-4 text-white md:p-5">
          {(tags.length > 0 || date) && (
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold uppercase tracking-wide md:text-[11px]">
              {tags.map((t) => (
                <span key={t.id} className="text-sky-300">
                  #{t.title.replace(/\s+/g, '_')}
                </span>
              ))}
              {tags.length > 0 && date && (
                <span aria-hidden className="text-white/50">
                  •
                </span>
              )}
              {date && <span className="text-white/80">{date}</span>}
            </div>
          )}
          <h3 className="line-clamp-2 text-sm font-bold leading-snug text-white md:text-base">
            {post.title}
          </h3>
          {excerpt && (
            <p className="line-clamp-2 max-h-0 overflow-hidden text-[11px] leading-relaxed text-white/75 opacity-0 transition-all duration-500 ease-out group-hover:max-h-20 group-hover:opacity-100 md:text-xs">
              {excerpt}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

/* ──────────── decorations ──────────── */

const Decorations: React.FC = () => {
  const reduced = useReducedMotion()
  return (
    <>
      {/* Smooth bridge from CoreValues — sky tint fades into white at the top */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-48 bg-linear-to-b from-sky-50/80 via-sky-50/30 to-transparent"
      />

      {/* Soft primary blob — top-left, echoing CoreValues' palette */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-24 h-112 w-md rounded-full bg-primary/8 blur-3xl"
      />

      {/* Outline ring — top-left, continuation of CoreValues rings */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-20 -left-16 hidden h-72 w-72 rounded-full border-2 border-sky-200/55 lg:block lg:h-96 lg:w-96"
      />

      {/* Solid pastel circle peeking from top-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-16 -left-12 hidden h-48 w-48 rounded-full bg-sky-100/70 md:block lg:h-64 lg:w-64"
      />

      {/* Indigo blob — bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-128 w-lg rounded-full bg-indigo-200/25 blur-3xl"
      />

      {/* Outline ring — bottom-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 -right-16 hidden h-72 w-72 rounded-full border-2 border-indigo-200/45 lg:block lg:h-88 lg:w-88"
      />

      {/* Dot grids */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-14 top-28 hidden h-28 w-28 opacity-50 lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(0,111,238,0.35) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-32 left-10 hidden h-24 w-24 opacity-50 lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(99,102,241,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute left-32 top-1/2 hidden h-20 w-20 -translate-y-1/2 opacity-40 lg:block"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(56,189,248,0.5) 1.5px, transparent 1.5px)',
          backgroundSize: '14px 14px',
        }}
      />

      {/* Small accent dot near the corner circle */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-44 top-44 hidden h-3 w-3 rounded-full bg-sky-300/70 lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-32 bottom-44 hidden h-3 w-3 rounded-full bg-indigo-300/70 lg:block"
      />

      {/* Floating sparkle — top */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-16 top-32 hidden lg:block"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.7, delay: 0.2 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -10, 0], rotate: [-8, 8, -8] }}
          transition={
            reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <IconSparkles className="size-9 text-primary/55" stroke={2} />
        </motion.div>
      </motion.div>

      {/* Floating star — bottom-right */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-24 bottom-32 hidden lg:block"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.7, delay: 0.4 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -8, 0], rotate: [6, -6, 6] }}
          transition={
            reduced ? undefined : { duration: 4.5, repeat: Infinity, ease: 'easeInOut' }
          }
        >
          <IconStarFilled className="size-7 text-amber-300/65" />
        </motion.div>
      </motion.div>
    </>
  )
}

/* ──────────── main view ──────────── */

export const CategoryShowcaseView: React.FC<Props> = ({
  eyebrow,
  heading,
  description,
  ctaLabel,
  posts,
}) => {
  // Collage uses up to 5 posts in fixed slot positions
  const [p1, p2, p3, p4, p5] = [posts[0], posts[1], posts[2], posts[3], posts[4]]

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-sky-50/40 via-white to-white py-16 md:py-20 lg:py-24">
      <Decorations />
      <motion.div
        className="container relative w-full"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        variants={container}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* TEXT — right column on lg+, first on mobile for reading flow */}
          <div className="lg:order-2 lg:col-span-5">
            {eyebrow && (
              <motion.span
                variants={fadeUp}
                className="mb-4 block text-xs font-bold uppercase tracking-[0.25em] text-primary"
              >
                {eyebrow}
              </motion.span>
            )}

            {heading && (
              <motion.h2
                variants={fadeUp}
                className="text-3xl font-black leading-[1.1] tracking-tight text-slate-900 md:text-4xl lg:text-5xl"
              >
                {heading}
              </motion.h2>
            )}

            {description && (
              <motion.div
                variants={fadeUp}
                className="mt-5 max-w-xl text-base leading-relaxed text-muted-foreground"
              >
                <RichText data={description} enableGutter={false} />
              </motion.div>
            )}

            {ctaLabel && (
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  href="/posts"
                  className="group inline-flex items-center justify-between gap-4 rounded-full bg-slate-900 px-7 py-4 text-sm font-semibold text-white shadow-[0_14px_30px_-12px_rgba(15,23,42,0.6)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_18px_36px_-12px_rgba(15,23,42,0.75)] md:text-base"
                >
                  <span>{ctaLabel}</span>
                  <span className="inline-flex size-8 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
                    <IconArrowRight className="size-4" stroke={2.4} />
                  </span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* COLLAGE — left column on lg+ */}
          {posts.length > 0 && (
            <motion.div className="lg:order-1 lg:col-span-7" variants={container}>
              <div className="grid auto-rows-[12rem] grid-cols-4 gap-3 md:auto-rows-[16rem] md:gap-4 lg:auto-rows-[19rem]">
                {/* Slot 1: top-left wide (cols 1-2 × row 1) */}
                {p1 && (
                  <motion.div
                    variants={popIn}
                    className="col-span-2 row-span-1 md:col-span-2 md:row-span-1"
                  >
                    <PhotoCard post={p1} className="h-full w-full" />
                  </motion.div>
                )}
                {/* Slot 2: top-mid narrow (col 3 × row 1) */}
                {p2 && (
                  <motion.div
                    variants={popIn}
                    className="col-span-2 row-span-1 md:col-span-1 md:row-span-1"
                  >
                    <PhotoCard post={p2} className="h-full w-full" />
                  </motion.div>
                )}
                {/* Slot 3: right tall (col 4 × rows 1-2) */}
                {p3 && (
                  <motion.div
                    variants={popIn}
                    className="col-span-2 row-span-1 md:col-span-1 md:row-span-2"
                  >
                    <PhotoCard post={p3} className="h-full w-full" />
                  </motion.div>
                )}
                {/* Slot 4: bottom-left narrow (col 1 × row 2) */}
                {p4 && (
                  <motion.div
                    variants={popIn}
                    className="col-span-2 row-span-1 md:col-span-1 md:row-span-1"
                  >
                    <PhotoCard post={p4} className="h-full w-full" />
                  </motion.div>
                )}
                {/* Slot 5: bottom-mid wide (cols 2-3 × row 2) */}
                {p5 && (
                  <motion.div
                    variants={popIn}
                    className="col-span-2 row-span-1 md:col-span-2 md:row-span-1"
                  >
                    <PhotoCard post={p5} className="h-full w-full" />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </section>
  )
}
