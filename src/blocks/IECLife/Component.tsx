import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { IECLifeBlock as Props, Post } from '@/payload-types'

import { IECLifeView } from './IECLifeView'

export const IECLifeBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  ctaLabel,
  limit: limitFromProps,
}) => {
  const limit = limitFromProps || 4
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    sort: '-publishedAt',
    limit,
    depth: 1,
  })

  const posts = docs as Post[]
  if (posts.length === 0) return null

  return (
    <IECLifeView posts={posts} eyebrow={eyebrow} heading={heading} ctaLabel={ctaLabel} />
  )
}
