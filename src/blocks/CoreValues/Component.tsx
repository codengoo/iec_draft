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
  const Cmp =
    (variant === 'alt' ? iconAltMap[key] : undefined) ?? iconMap[key] ?? IconSparkles
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

export const CoreValuesBlock: React.FC<Props> = ({
  eyebrow,
  eyebrowIcon,
  heading,
  headingHighlight,
  body,
  values,
  mascot,
  cta,
}) => {
  const primaryLink = cta?.[0]?.link

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-sky-50/60 via-background to-background py-20 lg:py-28">
      {/* Top fade — smooth white → transparent */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 z-1 h-32 bg-linear-to-b from-white to-transparent dark:from-background"
      />

      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 h-[32rem] w-[32rem] rounded-full bg-primary/5 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 right-10 h-72 w-72 rounded-full border-2 border-sky-200/50 lg:h-96 lg:w-96"
      />

      {/* Bottom-left filled circle (mirrors VisionMission) */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 -left-28 h-64 w-64 rounded-full bg-sky-100 md:h-80 md:w-80 lg:-bottom-32 lg:-left-32 lg:h-96 lg:w-96"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full border-2 border-sky-200/60 md:h-88 md:w-88 lg:-bottom-36 lg:-left-36 lg:h-104 lg:w-104"
      />

      {/* Dot grid — right side */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/3 right-12 hidden h-32 w-24 opacity-40 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,111,238,0.35) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="container relative w-full">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* LEFT — Text content + value cards */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {eyebrow && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <span className="inline-flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Icon name={eyebrowIcon} className="size-3" />
                </span>
                <span>{eyebrow}</span>
              </div>
            )}

            {(heading || headingHighlight) && (
              <h2 className="text-5xl font-black uppercase leading-[1] tracking-tight text-foreground md:text-6xl lg:text-7xl">
                {heading && <span className="block">{heading}</span>}
                {headingHighlight && (
                  <span className="mt-2 block text-primary">{headingHighlight}</span>
                )}
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
                  <motion.li
                    key={value.id ?? i}
                    initial={{ opacity: 0, y: 24 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.45, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  >
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
                  </motion.li>
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
          </motion.div>

          {/* RIGHT — Mascot on glowing pedestal with floating spheres */}
          <div className="relative flex min-h-[28rem] items-center justify-center lg:col-span-5">
            {/* Big soft halo behind mascot */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.12, 1], opacity: [0.5, 0.85, 0.5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="size-96 rounded-full bg-primary/10 blur-3xl" />
            </motion.div>

            {/* Floating spheres — give the 3D depth seen in the mockup */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-6 top-10 z-0 size-10 rounded-full bg-linear-to-br from-white via-sky-100 to-sky-300/70 shadow-[inset_-6px_-6px_14px_rgba(0,111,238,0.18),0_8px_18px_rgba(0,111,238,0.18)] lg:size-12"
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-2 bottom-32 z-0 size-7 rounded-full bg-linear-to-br from-white via-sky-100 to-sky-300/70 shadow-[inset_-4px_-4px_10px_rgba(0,111,238,0.2),0_6px_14px_rgba(0,111,238,0.2)]"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 3.5, delay: 0.7, repeat: Infinity, ease: 'easeInOut' }}
            />
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-32 left-6 z-0 size-6 rounded-full bg-linear-to-br from-white via-sky-100 to-sky-300/70 shadow-[inset_-3px_-3px_8px_rgba(0,111,238,0.2),0_5px_12px_rgba(0,111,238,0.2)]"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, delay: 1.2, repeat: Infinity, ease: 'easeInOut' }}
            />

            {/* Tiny sparkles */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute top-6 left-12 z-0 text-primary/60"
              animate={{ y: [0, -6, 0], rotate: [0, 18, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconSparkles className="size-4" />
            </motion.div>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-16 top-4 z-0 text-sky-400/70"
              animate={{ y: [0, -10, 0], rotate: [0, -12, 0] }}
              transition={{ duration: 3.5, delay: 0.6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconSparkles className="size-3" />
            </motion.div>

            {/* Mascot */}
            {mascot && typeof mascot === 'object' && (
              <motion.div
                className="relative z-10"
                initial={{ opacity: 0, scale: 0.85 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, ease: 'easeOut' }}
              >
                <motion.div
                  className="drop-shadow-2xl"
                  animate={{ y: [0, -14, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Media
                    resource={mascot}
                    imgClassName="h-auto w-72 select-none md:w-80 lg:w-96"
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Pedestal — layered rings to imitate the glowing podium in the mockup */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-1/2 z-0 -translate-x-1/2"
            >
              {/* Outer halo */}
              <div className="absolute -inset-x-10 -inset-y-3 rounded-[50%] bg-primary/25 blur-2xl" />
              {/* Ring stack */}
              <div className="relative flex flex-col items-center">
                <div className="h-2 w-72 rounded-[50%] bg-primary/40 blur-md" />
                <div className="mt-1 h-6 w-72 rounded-[50%] border border-primary/40 bg-linear-to-b from-white/80 to-sky-200/60 shadow-[0_0_30px_8px_rgba(0,111,238,0.25)]" />
                <div className="mt-1 h-2 w-60 rounded-[50%] bg-primary/30 blur-sm" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
