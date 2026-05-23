import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category, CategoryShowcaseBlock as Props, Post } from '@/payload-types'

import { CategoryShowcaseView } from './CategoryShowcaseView'

const COLLAGE_COUNT = 5

export const CategoryShowcaseBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  description,
  category,
  ctaLabel,
}) => {
  const categoryId =
    typeof category === 'object' && category !== null ? category.id : category

  if (!categoryId) return null

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { categories: { contains: categoryId } },
    sort: '-publishedAt',
    limit: COLLAGE_COUNT,
    depth: 1,
  })

  const posts = docs as Post[]
  if (posts.length === 0) return null

  const categoryResolved =
    typeof category === 'object' && category !== null ? (category as Category) : null

  return (
    <CategoryShowcaseView
      eyebrow={eyebrow}
      heading={heading}
      description={description}
      ctaLabel={ctaLabel}
      category={categoryResolved}
      posts={posts}
    />
  )
}
