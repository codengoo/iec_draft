'use client'

import { IconArrowRight, IconArrowUpRight, IconSparkles } from '@tabler/icons-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import type { Category, Post } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type SerializedDescription = NonNullable<
  React.ComponentProps<typeof RichText>['data']
>

type Props = {
  eyebrow?: string | null
  heading: string
  description?: SerializedDescription | null
  ctaLabel?: string | null
  category: Category | null
  pillPosts: Post[]
  bentoPosts: Post[]
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

const fadeLeft: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

const popIn: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

/* ──────────── pill row ──────────── */

const PostPill: React.FC<{ post: Post }> = ({ post }) => (
  <motion.div variants={fadeLeft}>
    <Link
      href={`/posts/${post.slug}`}
      className="group flex items-center justify-between gap-4 rounded-full bg-slate-900 px-5 py-3.5 text-sm font-semibold text-white shadow-[0_10px_25px_-12px_rgba(15,23,42,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-800 hover:shadow-[0_14px_30px_-12px_rgba(15,23,42,0.7)] md:px-6 md:py-4 md:text-base"
    >
      <span className="line-clamp-1">{post.title}</span>
      <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
        <IconArrowRight className="size-4" stroke={2.4} />
      </span>
    </Link>
  </motion.div>
)

/* ──────────── bento cards ──────────── */

type CardProps = { post: Post }

// Card 0: compact lavender card with image on top + title below
const SoftImageCard: React.FC<CardProps & { tone?: 'lavender' | 'white' }> = ({
  post,
  tone = 'lavender',
}) => {
  const bg = tone === 'lavender' ? 'bg-indigo-50' : 'bg-white'
  const ring = tone === 'lavender' ? 'ring-indigo-100' : 'ring-slate-100'
  return (
    <Link
      href={`/posts/${post.slug}`}
      className={`group flex h-full flex-col overflow-hidden rounded-3xl p-3 shadow-[0_25px_50px_-30px_rgba(0,0,0,0.25)] ring-1 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_60px_-25px_rgba(0,0,0,0.3)] ${bg} ${ring}`}
    >
      {post.heroImage && typeof post.heroImage === 'object' && (
        <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-muted">
          <Media
            fill
            resource={post.heroImage}
            imgClassName="object-cover transition-transform duration-700 group-hover:scale-105"
            size="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col gap-2 px-2 pb-2 pt-4 md:px-3 md:pb-3">
        <h3 className="line-clamp-2 text-sm font-bold leading-snug text-slate-900 transition-colors duration-300 group-hover:text-primary md:text-base">
          {post.title}
        </h3>
      </div>
    </Link>
  )
}

// Card 1: primary brand gradient card — image as background w/ blue overlay, title white
const BrandOverlayCard: React.FC<CardProps & { label?: string }> = ({ post, label }) => (
  <Link
    href={`/posts/${post.slug}`}
    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-primary p-6 text-white shadow-[0_25px_50px_-25px_rgba(0,111,238,0.55)] ring-1 ring-primary/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_60px_-22px_rgba(0,111,238,0.7)] md:p-7"
    style={{
      backgroundImage: 'linear-gradient(135deg, #006FEE 0%, #38BDF8 100%)',
    }}
  >
    {post.heroImage && typeof post.heroImage === 'object' && (
      <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-overlay">
        <Media
          fill
          resource={post.heroImage}
          imgClassName="object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
          size="(max-width: 1024px) 50vw, 25vw"
        />
      </div>
    )}
    <div className="pointer-events-none absolute -right-12 -top-12 size-44 rounded-full bg-white/10 blur-2xl" />
    {label && (
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
        <IconSparkles className="size-3" stroke={2.5} />
        {label}
      </span>
    )}
    <h3 className="relative mt-4 line-clamp-3 text-lg font-black leading-tight md:text-xl lg:text-2xl">
      {post.title}
    </h3>
    <span className="relative mt-3 inline-flex size-9 items-center justify-center rounded-full bg-white/20 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/30">
      <IconArrowUpRight className="size-4" stroke={2.5} />
    </span>
  </Link>
)

// Card 2: dark navy card — image bg + dark overlay, title white
const DarkOverlayCard: React.FC<CardProps & { label?: string }> = ({ post, label }) => (
  <Link
    href={`/posts/${post.slug}`}
    className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-slate-900 p-6 text-white shadow-[0_25px_50px_-25px_rgba(15,23,42,0.7)] ring-1 ring-slate-700/40 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_35px_60px_-22px_rgba(15,23,42,0.85)] md:p-7"
  >
    {post.heroImage && typeof post.heroImage === 'object' && (
      <>
        <div className="pointer-events-none absolute inset-0 opacity-35">
          <Media
            fill
            resource={post.heroImage}
            imgClassName="object-cover scale-110 transition-transform duration-700 group-hover:scale-125"
            size="(max-width: 1024px) 50vw, 25vw"
          />
        </div>
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900 via-slate-900/85 to-slate-900/30" />
      </>
    )}
    {label && (
      <span className="relative inline-flex w-fit items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-white/85 backdrop-blur-sm">
        {label}
      </span>
    )}
    <h3 className="relative mt-4 line-clamp-3 text-lg font-black leading-tight md:text-xl lg:text-2xl">
      {post.title}
    </h3>
    <span className="relative mt-3 inline-flex size-9 items-center justify-center rounded-full bg-white/15 text-white transition-all duration-300 group-hover:translate-x-1 group-hover:bg-white/25">
      <IconArrowUpRight className="size-4" stroke={2.5} />
    </span>
  </Link>
)

/* ──────────── decorations ──────────── */

const Decorations: React.FC = () => {
  const reduced = useReducedMotion()
  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-112 w-112 rounded-full bg-indigo-200/30 blur-3xl"
      />

      {/* Dot grid top-right */}
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 top-20 hidden h-28 w-28 opacity-50 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,111,238,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />
      {/* Dot grid bottom-left */}
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-16 left-8 hidden h-24 w-24 opacity-50 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(99,102,241,0.4) 1.5px, transparent 1.5px)',
          backgroundSize: '12px 12px',
        }}
      />

      {/* Floating sparkle */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-20 bottom-32 hidden lg:block"
        initial={{ opacity: 0, scale: 0.5 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '-10%' }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        <motion.div
          animate={reduced ? undefined : { y: [0, -10, 0], rotate: [-6, 6, -6] }}
          transition={reduced ? undefined : { duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <IconSparkles className="size-10 text-primary/70" stroke={2} />
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
  category,
  pillPosts,
  bentoPosts,
}) => {
  const allPostsHref = '/posts'
  // Bento cells (up to 4). Pad with undefined so unused cells render nothing.
  const [b0, b1, b2, b3] = [bentoPosts[0], bentoPosts[1], bentoPosts[2], bentoPosts[3]]

  return (
    <section className="relative overflow-hidden bg-linear-to-b from-slate-50/60 via-background to-background py-16 md:py-20 lg:py-24">
      <Decorations />

      <motion.div
        className="container relative"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        variants={container}
      >
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
          {/* LEFT */}
          <div className="lg:col-span-5">
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

            {pillPosts.length > 0 && (
              <motion.ul className="mt-8 flex flex-col gap-3" variants={container}>
                {pillPosts.map((post) => (
                  <li key={post.id}>
                    <PostPill post={post} />
                  </li>
                ))}
              </motion.ul>
            )}

            {ctaLabel && (
              <motion.div variants={fadeUp} className="mt-8">
                <Link
                  href={allPostsHref}
                  className="group inline-flex items-center gap-2 text-sm font-bold uppercase tracking-[0.2em] text-primary"
                >
                  <span className="relative">
                    {ctaLabel}
                    <span
                      aria-hidden
                      className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-primary transition-transform duration-300 group-hover:scale-x-100"
                    />
                  </span>
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full border border-primary/30 transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                    <IconArrowUpRight className="size-3.5" stroke={2.5} />
                  </span>
                </Link>
              </motion.div>
            )}
          </div>

          {/* RIGHT — bento 2x2 */}
          {bentoPosts.length > 0 && (
            <motion.div className="lg:col-span-7" variants={container}>
              <div className="grid grid-cols-2 gap-4 md:gap-5">
                {b0 && (
                  <motion.div variants={popIn} className="aspect-square md:aspect-[5/4]">
                    <SoftImageCard post={b0} tone="lavender" />
                  </motion.div>
                )}
                {b1 && (
                  <motion.div variants={popIn} className="aspect-square md:aspect-[5/4]">
                    <BrandOverlayCard post={b1} label={category?.title} />
                  </motion.div>
                )}
                {b2 && (
                  <motion.div variants={popIn} className="aspect-square md:aspect-[5/4]">
                    <DarkOverlayCard post={b2} label={category?.title} />
                  </motion.div>
                )}
                {b3 && (
                  <motion.div variants={popIn} className="aspect-square md:aspect-[5/4]">
                    <SoftImageCard post={b3} tone="white" />
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
