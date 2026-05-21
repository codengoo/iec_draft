import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Game, GamesPortfolioBlock as Props } from '@/payload-types'

import { GamesCarousel } from './GamesCarousel'
import { GamesPortfolioShell } from './GamesPortfolioShell'

export const GamesPortfolioBlock: React.FC<Props & { id?: string }> = async (props) => {
  const { eyebrow, heading, populateBy, selectedGames, limit: limitFromProps } = props

  const limit = limitFromProps || 9
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
    <GamesPortfolioShell>
      <GamesCarousel games={games} eyebrow={eyebrow ?? undefined} heading={heading} />
    </GamesPortfolioShell>
  )
}
