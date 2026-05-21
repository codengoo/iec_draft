'use client'

import {
  IconArrowRight,
  IconBolt,
  IconDeviceGamepad2,
  IconDeviceGamepad2Filled,
  IconEye,
  IconHeart,
  IconPalette,
  IconRocket,
  IconShield,
  IconSparkles,
  IconStar,
  IconTarget,
  IconTrophy,
  IconUsers,
  type IconProps,
} from '@tabler/icons-react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'

import type { VisionMissionBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'

type IconName =
  | 'gamepad'
  | 'users'
  | 'star'
  | 'heart'
  | 'sparkles'
  | 'shield'
  | 'trophy'
  | 'bolt'
  | 'target'
  | 'palette'
  | 'rocket'
  | 'eye'

const iconMap: Record<IconName, React.ComponentType<IconProps>> = {
  gamepad: IconDeviceGamepad2Filled,
  users: IconUsers,
  star: IconStar,
  heart: IconHeart,
  sparkles: IconSparkles,
  shield: IconShield,
  trophy: IconTrophy,
  bolt: IconBolt,
  target: IconTarget,
  palette: IconPalette,
  rocket: IconRocket,
  eye: IconEye,
}

const Icon: React.FC<{ name?: string | null; className?: string; stroke?: number }> = ({
  name,
  className,
  stroke = 2,
}) => {
  const Cmp = iconMap[(name as IconName) || 'gamepad'] ?? IconDeviceGamepad2
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

/** Render heading text, highlighting any "&" character in primary color. */
function renderHeading(text: string) {
  return text.split(/(&)/).map((part, i) =>
    part === '&' ? (
      <span key={i} className="text-primary">
        &amp;
      </span>
    ) : (
      <React.Fragment key={i}>{part}</React.Fragment>
    ),
  )
}

export const VisionMissionBlock: React.FC<Props> = ({
  eyebrow,
  eyebrowIcon,
  heading,
  body,
  features,
  mascot,
  cta,
  vision,
  mission,
}) => {
  const primaryLink = cta?.[0]?.link

  return (
    <section className="relative flex min-h-screen items-center overflow-hidden bg-gradient-to-b from-sky-50/60 via-background to-background py-20 lg:py-28">
      {/* Decorative background blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-primary/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 -left-32 h-[32rem] w-[32rem] rounded-full bg-sky-200/40 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-12 top-16 hidden h-32 w-32 opacity-40 lg:block"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(0,111,238,0.35) 1px, transparent 1px)',
          backgroundSize: '12px 12px',
        }}
      />

      <div className="container relative w-full">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* LEFT — Text content */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            {eyebrow && (
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-4 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <Icon name={eyebrowIcon} className="size-4" />
                <span>{eyebrow}</span>
              </div>
            )}

            {heading && (
              <h2 className="text-4xl font-black uppercase leading-[1.05] tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {renderHeading(heading)}
              </h2>
            )}

            <div className="mt-6 h-1 w-16 rounded-full bg-primary" />

            {body && (
              <div className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
                <RichText data={body} enableGutter={false} />
              </div>
            )}

            {Array.isArray(features) && features.length > 0 && (
              <ul className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {features.map((feature, i) => (
                  <motion.li
                    key={feature.id ?? i}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.1 + i * 0.08, ease: 'easeOut' }}
                  >
                    <span className="inline-flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white shadow-[0_8px_20px_-8px_rgba(0,111,238,0.35)] ring-1 ring-primary/10">
                      <Icon name={feature.icon} className="size-5 text-primary" stroke={2.2} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-extrabold uppercase tracking-wider text-foreground">
                        {feature.title}
                      </p>
                      {feature.description && (
                        <p className="mt-1 text-xs leading-snug text-muted-foreground">
                          {feature.description}
                        </p>
                      )}
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

          {/* CENTER — Mascot with glow */}
          <div className="relative flex min-h-80 items-center justify-center lg:col-span-4">
            {/* Glow orb — primary */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.18, 1], opacity: [0.55, 0.95, 0.55] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            </motion.div>

            {/* Glow orb — secondary */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute inset-0 flex items-center justify-center"
              animate={{ scale: [1, 1.25, 1], opacity: [0.35, 0.8, 0.35] }}
              transition={{ duration: 3.5, delay: 0.9, repeat: Infinity, ease: 'easeInOut' }}
            >
              <div className="h-56 w-56 rounded-full bg-sky-300/35 blur-2xl" />
            </motion.div>

            {/* Pedestal ring */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-6 left-1/2 h-6 w-56 -translate-x-1/2 rounded-full bg-primary/20 blur-md"
            />

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
                  animate={{ y: [0, -16, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Media resource={mascot} imgClassName="h-auto w-64 select-none md:w-72 lg:w-80" />
                </motion.div>
              </motion.div>
            )}

            {/* Floating sparkles */}
            <motion.div
              aria-hidden
              className="pointer-events-none absolute right-4 top-6 z-20 text-primary/70"
              animate={{ y: [0, -8, 0], rotate: [0, 18, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconSparkles className="size-5" />
            </motion.div>
            <motion.div
              aria-hidden
              className="pointer-events-none absolute bottom-12 left-2 z-20 text-sky-400/70"
              animate={{ y: [0, 10, 0], rotate: [0, -12, 0] }}
              transition={{ duration: 3.5, delay: 0.8, repeat: Infinity, ease: 'easeInOut' }}
            >
              <IconSparkles className="size-4" />
            </motion.div>
          </div>

          {/* RIGHT — Vision + Mission cards */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {vision && (
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.2, ease: 'easeOut' }}
              >
                <motion.div
                  className="group rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_50px_-20px_rgba(0,111,238,0.35)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_24px_60px_-18px_rgba(0,111,238,0.55)] dark:border-white/10 dark:bg-white/5"
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_20px_-6px_rgba(0,111,238,0.55)]">
                      <IconEye className="size-5" stroke={2.2} />
                    </span>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-extrabold uppercase tracking-wider text-primary">
                        Vision
                      </p>
                      <span className="h-px w-8 bg-primary/40" />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{vision}</p>
                </motion.div>
              </motion.div>
            )}

            {mission && (
              <motion.div
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.35, ease: 'easeOut' }}
              >
                <motion.div
                  className="group rounded-3xl border border-white/60 bg-white/80 p-6 shadow-[0_20px_50px_-20px_rgba(0,111,238,0.35)] backdrop-blur-md transition-shadow duration-300 hover:shadow-[0_24px_60px_-18px_rgba(0,111,238,0.55)] dark:border-white/10 dark:bg-white/5"
                  animate={{ y: [0, 8, 0] }}
                  transition={{ duration: 4, delay: 1, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <div className="mb-3 flex items-center gap-3">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-[0_10px_20px_-6px_rgba(0,111,238,0.55)]">
                      <IconRocket className="size-5" stroke={2.2} />
                    </span>
                    <div className="flex items-center gap-3">
                      <p className="text-base font-extrabold uppercase tracking-wider text-primary">
                        Mission
                      </p>
                      <span className="h-px w-8 bg-primary/40" />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/80">{mission}</p>
                </motion.div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
