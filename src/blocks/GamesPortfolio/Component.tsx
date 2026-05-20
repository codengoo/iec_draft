import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Game, GamesPortfolioBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'

export const GamesPortfolioBlock: React.FC<Props & { id?: string }> = async (props) => {
  const { eyebrow, heading, populateBy, selectedGames, limit: limitFromProps } = props

  const limit = limitFromProps || 3
  let games: Game[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    const fetched = await payload.find({
      collection: 'games',
      depth: 1,
      limit,
      sort: '-publishedAt',
    })
    games = fetched.docs
  } else if (Array.isArray(selectedGames)) {
    games = selectedGames
      .map((g) => (typeof g === 'object' ? g : null))
      .filter((g): g is Game => g !== null)
  }

  if (games.length === 0) return null

  return (
    <section className="container">
      <div className="mb-10 text-center">
        {eyebrow && (
          <span className="mb-2 inline-block text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            {eyebrow}
          </span>
        )}
        {heading && (
          <h2 className="text-2xl font-bold md:text-3xl lg:text-4xl">{heading}</h2>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {games.map((game) => {
          const href = game.playUrl || (game.slug ? `/games/${game.slug}` : null)
          const CardWrapper = ({ children }: { children: React.ReactNode }) =>
            href ? (
              <a
                href={href}
                target={game.playUrl ? '_blank' : undefined}
                rel={game.playUrl ? 'noreferrer' : undefined}
                className="group block"
              >
                {children}
              </a>
            ) : (
              <div className="block">{children}</div>
            )

          return (
            <CardWrapper key={game.id}>
              <article className="overflow-hidden rounded-lg border border-border bg-card transition group-hover:shadow-lg">
                {game.cover && typeof game.cover === 'object' && (
                  <div className="aspect-[4/3] overflow-hidden bg-muted">
                    <Media
                      resource={game.cover}
                      imgClassName="h-full w-full object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                )}
                <div className="p-5">
                  {Array.isArray(game.badges) && game.badges.length > 0 && (
                    <div className="mb-3 flex flex-wrap gap-2">
                      {game.badges.map((badge, i) => (
                        <span
                          key={i}
                          className="rounded-full bg-secondary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-secondary-foreground"
                        >
                          {badge.label}
                        </span>
                      ))}
                    </div>
                  )}
                  <h3 className="mb-1 text-lg font-bold leading-tight">{game.title}</h3>
                  {game.description && (
                    <p className="text-sm text-muted-foreground">{game.description}</p>
                  )}
                </div>
              </article>
            </CardWrapper>
          )
        })}
      </div>
    </section>
  )
}
