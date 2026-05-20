import React from 'react'

import type { VisionMissionBlock as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const VisionMissionBlock: React.FC<Props> = ({ heading, body, mascot, cta }) => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          {heading && (
            <h2 className="mb-6 text-2xl font-bold uppercase leading-tight md:text-3xl lg:text-4xl">
              {heading}
            </h2>
          )}
          {body && (
            <div className="mb-8 text-muted-foreground">
              <RichText data={body} enableGutter={false} />
            </div>
          )}
          {Array.isArray(cta) && cta.length > 0 && (
            <ul className="flex flex-wrap gap-3">
              {cta.map(({ link }, i) => (
                <li key={i}>
                  <CMSLink {...link} />
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center justify-center">
          {mascot && typeof mascot === 'object' && (
            <Media resource={mascot} imgClassName="max-w-full h-auto" />
          )}
        </div>
      </div>
    </section>
  )
}
