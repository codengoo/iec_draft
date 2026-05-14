'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import { CardBody, Chip, Card as HeroCard } from '@heroui/react'
import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'

export type CardPostData = Pick<
  Post,
  'slug' | 'categories' | 'tags' | 'meta' | 'title' | 'publishedAt'
>

function formatCardDate(timestamp: string): string {
  const date = new Date(timestamp)
  const DD = String(date.getDate()).padStart(2, '0')
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const YYYY = date.getFullYear()
  return `${DD}.${MM}.${YYYY}`
}

export const Card: React.FC<{
  alignItems?: 'center'
  className?: string
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const { className, doc, relationTo, showCategories, title: titleFromProps } = props

  const { slug, categories, tags, meta, title, publishedAt } = doc || {}
  const { image: metaImage } = meta || {}

  const hasCategories = categories && Array.isArray(categories) && categories.length > 0
  const hasTags = tags && Array.isArray(tags) && tags.length > 0
  const titleToUse = titleFromProps || title
  const href = `/${relationTo}/${slug}`

  return (
    <HeroCard
      ref={card.ref as React.RefObject<HTMLDivElement>}
      shadow="none"
      radius="lg"
      className={cn('overflow-hidden border border-border hover:cursor-pointer', className)}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {metaImage && typeof metaImage !== 'string' ? (
          <Media resource={metaImage} fill imgClassName="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            News
          </div>
        )}
      </div>

      <CardBody className="flex flex-col gap-2 p-4">
        {/* Category + Date row */}
        <div className="flex items-center justin nfy-between gap-2">
          {showCategories && hasCategories && (
            <div className="flex flex-wrap gap-1">
              {categories?.map((category, index) => {
                if (typeof category !== 'object') return null
                return (
                  <Chip
                    key={index}
                    size="sm"
                    color="primary"
                    variant="light"
                    classNames={{
                      base: 'px-1 h-auto min-w-0',
                      content: 'text-xs font-bold uppercase tracking-wide px-0',
                    }}
                  >
                    {category.title || 'Untitled'}
                  </Chip>
                )
              })}
            </div>
          )}
          {publishedAt && (
            <span className="text-xs text-muted-foreground whitespace-nowrap ml-auto">
              {formatCardDate(publishedAt)}
            </span>
          )}
        </div>

        {/* Title */}
        {titleToUse && (
          <h3 className="font-bold text-sm leading-snug line-clamp-3 text-foreground">
            <Link className="hover:underline" href={href} ref={link.ref}>
              {titleToUse}
            </Link>
          </h3>
        )}

        {/* Hashtags */}
        {hasTags && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags?.map((tag, i) => {
              if (typeof tag !== 'object') return null
              return (
                <Chip
                  key={i}
                  size="sm"
                  color="primary"
                  variant="light"
                  classNames={{
                    base: 'px-1 h-auto min-w-0',
                    content: 'text-xs px-0',
                  }}
                >
                  #{tag.title}
                </Chip>
              )
            })}
          </div>
        )}
      </CardBody>
    </HeroCard>
  )
}
