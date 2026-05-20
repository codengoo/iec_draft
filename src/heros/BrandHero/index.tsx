import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

type BrandHeroProps = NonNullable<Page['hero']>

export const BrandHero: React.FC<BrandHeroProps> = ({
  eyebrow,
  brandHeading,
  tagline,
  inlineStats,
  links,
  mascot,
}) => {
  return (
    <section className="relative overflow-hidden">
      <div className="container py-16 md:py-24">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            {eyebrow && (
              <span className="mb-4 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                {eyebrow}
              </span>
            )}
            {brandHeading && (
              <h1 className="mb-4 text-4xl font-bold leading-tight tracking-tight text-foreground md:text-5xl lg:text-6xl">
                {brandHeading}
              </h1>
            )}
            {tagline && (
              <p className="mb-8 max-w-xl text-base text-muted-foreground md:text-lg">{tagline}</p>
            )}

            {Array.isArray(links) && links.length > 0 && (
              <ul className="mb-8 flex flex-wrap gap-3">
                {links.map(({ link }, i) => (
                  <li key={i}>
                    <CMSLink {...link} />
                  </li>
                ))}
              </ul>
            )}

            {Array.isArray(inlineStats) && inlineStats.length > 0 && (
              <dl className="flex flex-wrap gap-x-10 gap-y-4">
                {inlineStats.map((stat, i) => (
                  <div key={i}>
                    <dt className="text-2xl font-bold text-foreground md:text-3xl">
                      {stat.value}
                    </dt>
                    <dd className="text-xs text-muted-foreground">{stat.label}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>

          <div className="flex items-center justify-center">
            {mascot && typeof mascot === 'object' && (
              <Media
                resource={mascot}
                imgClassName="max-w-full h-auto select-none"
                priority
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
