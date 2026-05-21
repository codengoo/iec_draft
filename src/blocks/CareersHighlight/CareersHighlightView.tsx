'use client'

import {
  IconArrowRight,
  IconBriefcase,
  IconBrush,
  IconCash,
  IconChartBar,
  IconCode,
  IconDeviceGamepad2,
  IconSparkles,
  IconStack2,
  IconStarFilled,
} from '@tabler/icons-react'
import { motion, useReducedMotion, type Variants } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import type { CareersHighlightBlock, Job, Media as MediaType } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

/* ──────────── helpers ──────────── */

type AccentName = 'indigo' | 'violet' | 'amber' | 'rose' | 'sky'

const accentPalette: Record<AccentName, { bg: string; text: string; chip: string }> = {
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    chip: 'bg-indigo-50 text-indigo-600',
  },
  violet: {
    bg: 'bg-violet-100',
    text: 'text-violet-600',
    chip: 'bg-violet-50 text-violet-600',
  },
  amber: {
    bg: 'bg-amber-100',
    text: 'text-amber-600',
    chip: 'bg-amber-50 text-amber-700',
  },
  rose: {
    bg: 'bg-rose-100',
    text: 'text-rose-600',
    chip: 'bg-rose-50 text-rose-600',
  },
  sky: {
    bg: 'bg-sky-100',
    text: 'text-sky-600',
    chip: 'bg-sky-50 text-sky-600',
  },
}

const accentRotation: AccentName[] = ['indigo', 'violet', 'amber', 'rose', 'sky']

function pickAccent(index: number): AccentName {
  return accentRotation[index % accentRotation.length]
}

function pickDepartmentIcon(dept?: string | null) {
  if (!dept) return IconBriefcase
  const d = dept.toLowerCase()
  if (d.includes('design') && (d.includes('game') || d.includes('level')))
    return IconDeviceGamepad2
  if (d.includes('engineer') || d.includes('dev') || d.includes('tech') || d.includes('program'))
    return IconCode
  if (d.includes('art') || d.includes('ui') || d.includes('ux') || d.includes('design'))
    return IconBrush
  if (d.includes('data') || d.includes('analyt') || d.includes('research'))
    return IconChartBar
  if (d.includes('product') || d.includes('manage') || d.includes('ops')) return IconStack2
  return IconBriefcase
}

/* ──────────── types ──────────── */

type Props = {
  eyebrow?: string | null
  heading: string
  headingHighlight?: string | null
  description?: string | null
  ctaLabel?: string | null
  ctaLink?: CareersHighlightBlock['ctaLink'] | null
  jobs: Job[]
  heroImage?: MediaType | null
}

/* ──────────── motion ──────────── */

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
  hidden: { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.55, ease: 'easeOut' },
  },
}

/* ──────────── decorations ──────────── */

const Decorations: React.FC = () => {
  const reduced = useReducedMotion()
  return (
    <>
      {/* Top & bottom transparent fades — blend with adjacent sections */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-10 h-40 bg-linear-to-b from-white via-white/80 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-40 bg-linear-to-t from-white via-white/80 to-transparent"
      />

      {/* Soft pastel halo on the right (behind the illustration) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-0 hidden h-112 w-md rounded-full bg-indigo-200/40 blur-3xl lg:block"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-1/3 -top-12 hidden h-72 w-72 rounded-full bg-violet-200/30 blur-3xl lg:block"
      />

      {/* Subtle pastel dot grid */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(129,140,248,0.18) 1.2px, transparent 1.2px)',
          backgroundSize: '24px 24px',
          maskImage:
            'radial-gradient(ellipse 75% 60% at 50% 45%, black 40%, transparent 90%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 60% at 50% 45%, black 40%, transparent 90%)',
        }}
      />

      {/* Floating accents */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute left-16 top-24 hidden lg:block"
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
          <IconSparkles className="size-7 text-indigo-400/55" stroke={2} />
        </motion.div>
      </motion.div>

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
          <IconStarFilled className="size-5 text-violet-300/70" />
        </motion.div>
      </motion.div>
    </>
  )
}

/* ──────────── heading with highlighted suffix ──────────── */

const HeadingWithHighlight: React.FC<{ text: string; highlight?: string | null }> = ({
  text,
  highlight,
}) => {
  if (!highlight) return <>{text}</>
  const trimmed = text.trimEnd()
  if (trimmed.toLowerCase().endsWith(highlight.toLowerCase())) {
    const head = trimmed.slice(0, trimmed.length - highlight.length).trimEnd()
    return (
      <>
        {head && (
          <span className="block text-slate-900">{head}</span>
        )}
        <span className="block text-primary">{highlight}</span>
      </>
    )
  }
  return <>{text}</>
}

/* ──────────── job card ──────────── */

const JobCard: React.FC<{ job: Job; index: number }> = ({ job, index }) => {
  const accent = accentPalette[pickAccent(index)]
  const Icon = pickDepartmentIcon(job.department)

  return (
    <motion.article
      variants={popIn}
      className="group relative flex min-h-60 flex-col rounded-2xl border border-white/70 bg-white/85 p-6 shadow-[0_18px_45px_-25px_rgba(79,70,229,0.35)] ring-1 ring-slate-900/3 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_60px_-25px_rgba(79,70,229,0.45)]"
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div
          className={`inline-flex h-12 w-12 items-center justify-center rounded-full ${accent.bg} ${accent.text}`}
        >
          <Icon size={22} />
        </div>
        {job.salaryLabel && (
          <span
            className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-semibold ${accent.chip}`}
          >
            <IconCash size={13} />
            {job.salaryLabel}
          </span>
        )}
      </div>

      <h3 className="mb-2 line-clamp-2 text-base font-bold leading-snug text-slate-900 md:text-lg">
        {job.title}
      </h3>

      {job.description && (
        <p className="mb-5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-500">
          {job.description}
        </p>
      )}

      <Link
        href={`/career/${job.id}`}
        className={`mt-auto inline-flex items-center gap-1.5 text-sm font-semibold ${accent.text} transition-colors`}
      >
        Apply now
        <IconArrowRight
          size={16}
          className="transition-transform duration-300 group-hover:translate-x-1"
        />
      </Link>
    </motion.article>
  )
}

/* ──────────── main view ──────────── */

export const CareersHighlightView: React.FC<Props> = ({
  eyebrow,
  heading,
  headingHighlight,
  description,
  ctaLabel,
  ctaLink,
  jobs,
  heroImage,
}) => {
  return (
    <section className="relative overflow-hidden bg-linear-to-b from-white via-indigo-50/60 to-white py-16 md:py-20 lg:py-24">
      <Decorations />

      {/* Hero illustration — top-right, behind text */}
      {heroImage && typeof heroImage === 'object' && (
        <motion.div
          aria-hidden
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: '-15%' }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-none absolute right-0 top-0 z-0 hidden h-full w-[55%] select-none md:block lg:w-[45%]"
        >
          <div className="relative h-full w-full">
            <Media
              fill
              resource={heroImage}
              imgClassName="object-contain object-right-top opacity-90"
              size="(max-width: 1024px) 50vw, 600px"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-linear-to-r from-white via-white/60 to-transparent"
            />
            <div
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-white via-white/70 to-transparent"
            />
          </div>
        </motion.div>
      )}

      <motion.div
        className="container relative z-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-15%' }}
        variants={container}
      >
        {/* Header */}
        <div className="max-w-2xl">
          {eyebrow && (
            <motion.span
              variants={fadeUp}
              className="mb-4 block text-xs font-bold uppercase tracking-[0.28em] text-primary"
            >
              {eyebrow}
            </motion.span>
          )}

          {heading && (
            <motion.h2
              variants={fadeUp}
              className="text-4xl font-black leading-[1.05] tracking-tight md:text-5xl lg:text-6xl"
            >
              <HeadingWithHighlight text={heading} highlight={headingHighlight} />
            </motion.h2>
          )}

          <motion.div
            variants={fadeUp}
            aria-hidden
            className="mt-5 h-1 w-16 rounded-full bg-primary/80"
          />

          {description && (
            <motion.p
              variants={fadeUp}
              className="mt-6 max-w-md text-base leading-relaxed text-slate-600"
            >
              {description}
            </motion.p>
          )}
        </div>

        {/* Cards */}
        {jobs.length > 0 && (
          <motion.div
            variants={container}
            className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-7"
          >
            {jobs.map((job, i) => (
              <JobCard key={job.id} job={job} index={i} />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        {ctaLink && ctaLabel && (
          <motion.div variants={fadeUp} className="mt-12 flex justify-center">
            <CMSLink
              {...ctaLink}
              appearance="inline"
              className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-[0_18px_36px_-12px_rgba(79,70,229,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_22px_42px_-12px_rgba(79,70,229,0.65)]"
            >
              <span>{ctaLabel}</span>
              <IconArrowRight
                size={18}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </CMSLink>
          </motion.div>
        )}
      </motion.div>
    </section>
  )
}
