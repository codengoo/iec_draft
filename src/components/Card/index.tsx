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
  compact?: boolean
  doc?: CardPostData
  relationTo?: 'posts'
  showCategories?: boolean
  title?: string
}> = (props) => {
  const { card, link } = useClickableCard({})
  const {
    className,
    compact = false,
    doc,
    relationTo,
    showCategories,
    title: titleFromProps,
  } = props

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
      className={cn(
        'group relative overflow-hidden border border-border bg-white hover:cursor-pointer',
        'transition-all duration-500 ease-out',
        'hover:-translate-y-1.5 hover:shadow-2xl hover:border-primary/40',
        className,
      )}
    >
      {/* Image */}
      <div className="relative w-full aspect-video overflow-hidden bg-muted">
        {metaImage && typeof metaImage !== 'string' ? (
          <>
            <Media
              resource={metaImage}
              fill
              imgClassName="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            {/* Subtle dark gradient at bottom for depth */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
            News
          </div>
        )}
      </div>

      <CardBody className={cn('flex flex-col', compact ? 'gap-1.5 p-3' : 'gap-3 p-5')}>
        {/* Category + Date row */}
        <div className="flex items-center justify-between gap-2">
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
          <h3
            className={cn(
              'font-bold leading-snug line-clamp-3 text-foreground transition-colors duration-300 group-hover:text-primary',
              compact ? 'text-sm' : 'text-lg',
            )}
          >
            <Link href={href} ref={link.ref} className="relative inline">
              <span className="bg-[linear-gradient(currentColor,currentColor)] bg-size-[0%_2px] bg-bottom-left bg-no-repeat transition-[background-size] duration-500 ease-out group-hover:bg-size-[100%_2px]">
                {titleToUse}
              </span>
            </Link>
          </h3>
        )}

        {/* Hashtags */}
        {hasTags && (
          <div className="flex flex-wrap gap-1 mt-auto pt-1">
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
