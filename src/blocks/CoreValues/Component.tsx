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
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { createContext, useContext, useState } from 'react'

import type { CoreValuesBlock as Props, Media as MediaType } from '@/payload-types'

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

/* ─────────────────────────────────────────────────────────────────
   Hover context — shared state between Left cards and Right image.
   Must wrap both Left and Right sub-components.
   ───────────────────────────────────────────────────────────────── */

type CoreValuesHoverState = {
  hoveredIndex: number | null
  setHoveredIndex: (i: number | null) => void
}

const CoreValuesHoverContext = createContext<CoreValuesHoverState>({
  hoveredIndex: null,
  setHoveredIndex: () => {},
})

export const CoreValuesHoverProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  return (
    <CoreValuesHoverContext.Provider value={{ hoveredIndex, setHoveredIndex }}>
      {children}
    </CoreValuesHoverContext.Provider>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Left content
   ───────────────────────────────────────────────────────────────── */

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
  const { setHoveredIndex } = useContext(CoreValuesHoverContext)

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
            <li
              key={value.id ?? i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onFocus={() => setHoveredIndex(i)}
              onBlur={() => setHoveredIndex(null)}
            >
              <div className="group flex h-full items-start gap-4 rounded-2xl border border-white/60 bg-white/80 p-5 shadow-[0_20px_50px_-25px_rgba(0,111,238,0.35)] backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_60px_-20px_rgba(0,111,238,0.55)] dark:border-white/10 dark:bg-white/5">
                <span className="inline-flex size-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/15 to-sky-200/40 text-primary ring-1 ring-primary/15 transition-transform duration-300 group-hover:scale-110 group-hover:from-primary/25 group-hover:to-sky-300/60">
                  <Icon name={value.icon} className="size-6" stroke={2.2} />
                </span>
                <div className="min-w-0">
                  <p
                    className="bg-clip-text text-sm font-extrabold uppercase tracking-wider text-foreground transition-colors duration-300 group-hover:text-transparent"
                    style={{
                      backgroundImage:
                        'linear-gradient(120deg, #006FEE 0%, #38BDF8 55%, #0EA5E9 100%)',
                    }}
                  >
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

/* ─────────────────────────────────────────────────────────────────
   Right content — mascot by default; swaps to hovered card's image
   ───────────────────────────────────────────────────────────────── */

export const CoreValuesRightContent: React.FC<Props> = ({ mascot, values }) => {
  const { hoveredIndex } = useContext(CoreValuesHoverContext)

  const hoveredValue = hoveredIndex !== null && values ? values[hoveredIndex] : null
  const hoveredImage =
    hoveredValue?.image && typeof hoveredValue.image === 'object'
      ? (hoveredValue.image as MediaType)
      : null
  const hoveredCaption = hoveredValue?.imageCaption ?? null

  return (
    <div className="relative flex min-h-112 items-center justify-center">
      {/* Big soft halo behind everything */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <div className="size-96 rounded-full bg-primary/10 blur-3xl" />
      </motion.div>

      {/* Mascot — outer layer controls visibility (one-time tween),
          inner layer keeps an independent floating loop so re-appearing
          after unhover doesn't reset or yo-yo the opacity. */}
      {mascot && typeof mascot === 'object' && (
        <motion.div
          className="relative z-10"
          animate={{
            opacity: hoveredImage ? 0 : 1,
            scale: hoveredImage ? 0.9 : 1,
          }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          <motion.div
            className="drop-shadow-2xl"
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Media resource={mascot} imgClassName="h-auto w-72 select-none md:w-80 lg:w-96" />
          </motion.div>
        </motion.div>
      )}

      {/* Hovered card: image + caption together in a single white card —
          bo góc mềm, soft shadow, floating as one unit */}
      <AnimatePresence mode="wait">
        {hoveredImage && (
          <motion.div
            key={hoveredIndex}
            className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center"
            initial={{ opacity: 0, y: 30, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          >
            <motion.div
              className="rounded-4xl bg-white p-3 shadow-[0_30px_80px_-20px_rgba(0,111,238,0.45),0_10px_30px_-12px_rgba(0,0,0,0.18)] ring-1 ring-white/60 dark:bg-white/95"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="overflow-hidden rounded-3xl">
                <Media
                  resource={hoveredImage}
                  imgClassName="block h-auto w-72 select-none md:w-80 lg:w-96"
                />
              </div>
              {hoveredCaption && (
                <p className="mt-4 px-3 pb-2 text-center text-base font-medium leading-relaxed text-foreground/85 md:text-lg">
                  {hoveredCaption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────────────
   Full block — standalone (wraps both sub-components in Provider)
   ───────────────────────────────────────────────────────────────── */

export const CoreValuesBlock: React.FC<Props> = (props) => {
  return (
    <CoreValuesHoverProvider>
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
    </CoreValuesHoverProvider>
  )
}
