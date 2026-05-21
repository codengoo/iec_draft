import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type { Category, CategoryShowcaseBlock as Props, Post } from '@/payload-types'

import { CategoryShowcaseView } from './CategoryShowcaseView'

const BENTO_COUNT = 4

export const CategoryShowcaseBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  description,
  category,
  pillsCount: pillsCountFromProps,
  ctaLabel,
}) => {
  const pillsCount = pillsCountFromProps ?? 3
  const total = pillsCount + BENTO_COUNT

  const categoryId =
    typeof category === 'object' && category !== null ? category.id : category

  if (!categoryId) return null

  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'posts',
    where: { categories: { contains: categoryId } },
    sort: '-publishedAt',
    limit: total,
    depth: 1,
  })

  const posts = docs as Post[]
  if (posts.length === 0) return null

  const categoryResolved =
    typeof category === 'object' && category !== null ? (category as Category) : null

  const pillPosts = posts.slice(0, pillsCount)
  const bentoPosts = posts.slice(pillsCount, pillsCount + BENTO_COUNT)

  return (
    <CategoryShowcaseView
      eyebrow={eyebrow}
      heading={heading}
      description={description}
      ctaLabel={ctaLabel}
      category={categoryResolved}
      pillPosts={pillPosts}
      bentoPosts={bentoPosts}
    />
  )
}
