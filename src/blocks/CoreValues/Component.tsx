'use client'

import {
  IconArrowRight,
  IconBolt,
  IconCoffee,
  IconDeviceGamepad2Filled,
  IconDiamondFilled,
  IconEye,
  IconFlame,
  IconHeartFilled,
  IconMoonStars,
  IconPalette,
  IconRocket,
  IconShield,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrophy,
  IconUsers,
  IconZzz,
  type IconProps,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import type { CoreValuesBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { SectionBackground } from '@/components/SectionBackground'

type IconName =
  | 'sparkles'
  | 'diamond'
  | 'sleep'
  | 'gamepad'
  | 'heart'
  | 'star'
  | 'users'
  | 'shield'
  | 'trophy'
  | 'bolt'
  | 'target'
  | 'palette'
  | 'rocket'
  | 'eye'
  | 'flame'
  | 'coffee'

const iconMap: Record<IconName, React.ComponentType<IconProps>> = {
  sparkles: IconSparkles,
  diamond: IconDiamondFilled,
  sleep: IconZzz,
  gamepad: IconDeviceGamepad2Filled,
  heart: IconHeartFilled,
  star: IconStar,
  users: IconUsers,
  shield: IconShield,
  trophy: IconTrophy,
  bolt: IconBolt,
  target: IconTarget,
  palette: IconPalette,
  rocket: IconRocket,
  eye: IconEye,
  flame: IconFlame,
  coffee: IconCoffee,
}

// Some icons (sleep) look better with the outline variant — overrides for nicer rendering.
const iconAltMap: Partial<Record<IconName, React.ComponentType<IconProps>>> = {
  sleep: IconMoonStars,
}

const Icon: React.FC<{
  name?: string | null
  className?: string
  stroke?: number
  variant?: 'default' | 'alt'
}> = ({ name, className, stroke = 2, variant = 'default' }) => {
  const key = (name as IconName) || 'sparkles'
  const Cmp = (variant === 'alt' ? iconAltMap[key] : undefined) ?? iconMap[key] ?? IconSparkles
  return <Cmp className={className} stroke={stroke} />
}

type CtaLink = NonNullable<NonNullable<Props['cta']>[number]>['link']

function resolveLinkHref(link: CtaLink): string {
  if (
    link.type === 'reference' &&
    typeof link.reference?.value === 'object' &&
    link.reference.value &&
    'slug' in link.reference.value
  ) {
    const slug = link.reference.value.slug
    return link.reference.relationTo === 'pages'
      ? `/${slug}`
      : `/${link.reference.relationTo}/${slug}`
  }
  if (link.type === 'route') return link.route ?? '#'
  return link.url ?? '#'
}

/**
 * Left column content — eyebrow + 2-line heading + body + 2x2 value cards + CTA.
 * Used standalone inside CoreValuesBlock, and by PinnedCrossfade.
 */
export const CoreValuesLeftContent: React.FC<Props> = ({
  eyebrow,
  eyebrowIcon,
  heading,
  headingHighlight,
  body,
  values,
  cta,
}) => {
  const primaryLink = cta?.[0]?.link

  return (
    <>
      {eyebrow && (
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
          <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Icon name={eyebrowIcon} className="size-3" />
          </span>
          <span>{eyebrow}</span>
        </div>
      )}

      {(heading || headingHighlight) && (
        <h2 className="text-5xl font-black uppercase leading-none tracking-tight text-foreground md:text-6xl lg:text-7xl">
          {heading && <span className="block">{heading}</span>}
          {headingHighlight && <span className="mt-2 block text-primary">{headingHighlight}</span>}
        </h2>
      )}

      <div className="mt-6 h-1 w-20 rounded-full bg-primary" />

      {body && (
        <div className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
          <RichText data={body} enableGutter={false} />
        </div>
      )}

      {Array.isArray(values) && values.length > 0 && (
        <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {values.map((value, i) => (
            <li key={value.id ?? i}>
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-25px_rgba(0,111,238,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_24px_60px_-20px_rgba(0,111,238,0.55)] dark:border-white/10 dark:bg-white/5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-sky-200/40 text-primary ring-1 ring-primary/15">
                  <Icon name={value.icon} className="size-6" stroke={2.2} />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                    {value.title}
                  </p>
                  {value.description && (
                    <p className="mt-1.5 text-xs leading-relaxed text-muted-foreground">
                      {value.description}
                    </p>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {primaryLink && (
        <div className="mt-10">
          <Link
            href={resolveLinkHref(primaryLink)}
            target={primaryLink.newTab ? '_blank' : undefined}
            rel={primaryLink.newTab ? 'noreferrer' : undefined}
            className="group inline-flex items-center gap-3 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_14px_30px_-10px_rgba(0,111,238,0.55)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_18px_36px_-10px_rgba(0,111,238,0.65)]"
          >
            <span>{primaryLink.label}</span>
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-white/95 text-primary transition-transform duration-300 group-hover:translate-x-1">
              <IconArrowRight className="size-4" stroke={2.5} />
            </span>
          </Link>
        </div>
      )}
    </>
  )
}

/**
 * Right column content — mascot with halo glow.
 * Used standalone inside CoreValuesBlock, and by PinnedCrossfade.
 */
export const CoreValuesRightContent: React.FC<Props> = ({ mascot }) => {
  return (
    <div className="relative flex min-h-112 items-center justify-center">
      {/* Big soft halo behind mascot */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="size-96 rounded-full bg-primary/10 blur-3xl" />
      </motion.div>

      {/* Mascot */}
      {mascot && typeof mascot === 'object' && (
        <motion.div
          className="drop-shadow-2xl relative z-10"
          animate={{ y: [0, -14, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <Media resource={mascot} imgClassName="h-auto w-72 select-none md:w-80 lg:w-96" />
        </motion.div>
      )}
    </div>
  )
}

/**
 * Full section — used for standalone rendering (when the block is NOT paired
 * with a preceding VisionMission block). Includes background, container, and
 * grid layout. When paired, PinnedCrossfade renders Left/Right sub-components
 * directly and supplies its own background.
 */
export const CoreValuesBlock: React.FC<Props> = (props) => {
  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-sky-50/60 via-background to-background py-20 lg:py-28">
      <SectionBackground />

      <div className="container relative w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-7">
            <CoreValuesLeftContent {...props} />
          </div>
          <div className="lg:col-span-5">
            <CoreValuesRightContent {...props} />
          </div>
        </div>
      </div>
    </section>
  )
}
