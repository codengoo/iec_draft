import React from 'react'
import Link from 'next/link'
import { IconArrowRight } from '@tabler/icons-react'

import type { Home, Page, Media as MediaType } from '@/payload-types'

import { Media } from '@/components/Media'
import { ShareWidget, type SharePlatformKey } from '@/components/ShareWidget'
import { getMediaUrl } from '@/utilities/getMediaUrl'

type BrandHeroProps = NonNullable<Page['hero']> | NonNullable<Home['hero']>

type DecorPosition =
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'middleLeft'
  | 'middleRight'

const positionClass: Record<DecorPosition, string> = {
  topLeft: 'top-6 left-6 md:top-10 md:left-10',
  topRight: 'top-6 right-6 md:top-10 md:right-10',
  bottomLeft: 'bottom-6 left-6 md:bottom-10 md:left-10',
  bottomRight: 'bottom-6 right-6 md:bottom-10 md:right-10',
  middleLeft: 'top-1/2 left-6 -translate-y-1/2 md:left-12',
  middleRight: 'top-1/2 right-6 -translate-y-1/2 md:right-12',
}

function resolveLinkHref(link: NonNullable<NonNullable<BrandHeroProps['links']>[number]>['link']) {
  if (link.type === 'reference' && typeof link.reference?.value === 'object' && link.reference.value && 'slug' in link.reference.value) {
    const slug = link.reference.value.slug
    return link.reference.relationTo === 'pages' ? `/${slug}` : `/${link.reference.relationTo}/${slug}`
  }
  if (link.type === 'route') return link.route ?? '#'
  return link.url ?? '#'
}

export const BrandHero: React.FC<BrandHeroProps> = ({
  eyebrow,
  brandHeading,
  tagline,
  inlineStats,
  links,
  mascot,
  decorations,
  share,
}) => {
  const primaryLink = links?.[0]?.link

  const qrLogoUrl =
    share?.qrLogo && typeof share.qrLogo === 'object' ? getMediaUrl(share.qrLogo.url) : undefined

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse at top right, oklch(96% 0.04 230) 0%, transparent 55%), radial-gradient(ellipse at bottom left, oklch(96% 0.04 285) 0%, transparent 50%), #ffffff',
        }}
      />

      {/* Accent diagonal lines (cyan top-right, lavender mid) */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 1440 720"
      >
        <defs>
          <linearGradient id="brandHeroLineCyan" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67E8F9" stopOpacity="0" />
            <stop offset="60%" stopColor="#67E8F9" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#67E8F9" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="brandHeroLineLavender" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C7D2FE" stopOpacity="0" />
            <stop offset="50%" stopColor="#A5B4FC" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#C7D2FE" stopOpacity="0" />
          </linearGradient>
        </defs>
        <line x1="560" y1="720" x2="1440" y2="-40" stroke="url(#brandHeroLineCyan)" strokeWidth="1.5" />
        <line x1="700" y1="540" x2="1440" y2="360" stroke="url(#brandHeroLineLavender)" strokeWidth="1.2" />
      </svg>

      {/* Decorations (absolute) */}
      {Array.isArray(decorations) &&
        decorations.map((dec, i) => {
          if (!dec.image || typeof dec.image !== 'object') return null
          const pos = (dec.position ?? 'topLeft') as DecorPosition
          const size = dec.sizePercent ?? 8
          return (
            <div
              key={dec.id ?? i}
              aria-hidden
              className={`pointer-events-none absolute select-none ${positionClass[pos]}`}
              style={{ width: `${size}%`, maxWidth: '180px', minWidth: '40px' }}
            >
              <Media resource={dec.image as MediaType} imgClassName="w-full h-auto opacity-90" />
            </div>
          )
        })}

      <div className="container relative py-20 md:py-28 lg:py-32">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            {eyebrow && (
              <span className="mb-5 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {brandHeading && (
              <div className="relative mb-6 inline-block">
                {/* Soft colored glow behind heading */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -inset-x-6 -inset-y-3 -z-10 rounded-4xl opacity-70 blur-3xl"
                  style={{
                    background:
                      'radial-gradient(45% 60% at 25% 50%, rgba(103, 232, 249, 0.55) 0%, transparent 70%), radial-gradient(45% 60% at 75% 50%, rgba(167, 139, 250, 0.5) 0%, transparent 70%), radial-gradient(50% 70% at 50% 50%, rgba(55, 48, 163, 0.35) 0%, transparent 75%)',
                  }}
                />
                <h1
                  className="relative bg-clip-text text-5xl font-black leading-[1.05] tracking-tight text-transparent md:text-6xl lg:text-7xl"
                  style={{
                    backgroundImage:
                      'linear-gradient(120deg, #0F0E2E 0%, #3730A3 45%, #6366F1 75%, #1E1B4B 100%)',
                  }}
                >
                  {brandHeading}
                </h1>
              </div>
            )}
            {tagline && (
              <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground md:text-lg">
                {tagline}
              </p>
            )}

            {Array.isArray(inlineStats) && inlineStats.length > 0 && (
              <dl className="mb-10 flex flex-wrap gap-x-12 gap-y-4">
                {inlineStats.map((stat, i) => (
                  <div key={i}>
                    <dt className="text-3xl font-bold leading-none text-foreground md:text-4xl">
                      {stat.value}
                    </dt>
                    <dd className="mt-1 text-xs uppercase tracking-wide text-muted-foreground">
                      {stat.label}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="flex items-center gap-3">
              {primaryLink && (
                <Link
                  href={resolveLinkHref(primaryLink)}
                  target={primaryLink.newTab ? '_blank' : undefined}
                  rel={primaryLink.newTab ? 'noreferrer' : undefined}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:opacity-90 hover:shadow-md md:px-7 md:py-3.5 md:text-base"
                >
                  {primaryLink.label}
                  <IconArrowRight size={18} stroke={2.5} />
                </Link>
              )}
              <ShareWidget
                shareText={brandHeading ?? ''}
                enabledPlatforms={share?.enabledPlatforms as SharePlatformKey[] | undefined}
                qrLogo={qrLogoUrl}
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:col-span-6">
            {mascot && typeof mascot === 'object' && (
              <Media
                resource={mascot}
                imgClassName="max-w-full h-auto select-none drop-shadow-xl"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
