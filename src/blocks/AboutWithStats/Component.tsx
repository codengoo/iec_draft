import React from 'react'

import type { AboutWithStatsBlock as Props } from '@/payload-types'

import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

export const AboutWithStatsBlock: React.FC<Props> = ({ heading, description, mascot, stats }) => {
  return (
    <section className="container">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
        <div className="lg:col-span-7">
          {heading && (
            <h2 className="mb-6 text-2xl font-bold uppercase leading-tight md:text-3xl lg:text-4xl">
              {heading}
            </h2>
          )}
          <div className="flex flex-col-reverse gap-6 md:flex-row md:items-end">
            {description && (
              <div className="flex-1">
                <RichText data={description} enableGutter={false} />
              </div>
            )}
            {mascot && typeof mascot === 'object' && (
              <div className="w-40 shrink-0 md:w-48">
                <Media resource={mascot} imgClassName="w-full h-auto" />
              </div>
            )}
          </div>
        </div>

        {Array.isArray(stats) && stats.length > 0 && (
          <dl className="lg:col-span-5 flex flex-col gap-8">
            {stats.map((stat, i) => (
              <div key={i}>
                <dt className="text-4xl font-bold text-primary md:text-5xl">{stat.value}</dt>
                <dd className="text-sm text-muted-foreground">{stat.label}</dd>
              </div>
            ))}
          </dl>
        )}
      </div>
    </section>
  )
}
