import React from 'react'

import type { CoreValuesBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'

export const CoreValuesBlock: React.FC<Props> = ({ accentIcon, heading, values, mascot }) => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <div>
          {accentIcon && typeof accentIcon === 'object' && (
            <div className="mb-4 h-10 w-10">
              <Media resource={accentIcon} imgClassName="h-full w-full" />
            </div>
          )}
          {heading && (
            <h2 className="mb-8 text-2xl font-bold uppercase leading-tight md:text-3xl lg:text-4xl">
              {heading}
            </h2>
          )}
          {Array.isArray(values) && values.length > 0 && (
            <ul className="space-y-3">
              {values.map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-base font-medium">
                  <span aria-hidden className="text-primary">
                    ✦
                  </span>
                  <span>{item.label}</span>
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
