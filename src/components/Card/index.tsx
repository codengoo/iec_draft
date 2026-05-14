'use client'
import { cn } from '@/utilities/ui'
import useClickableCard from '@/utilities/useClickableCard'
import Link from 'next/link'
import React, { Fragment } from 'react'

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
    <article
      className={cn(
        'border border-border rounded-xl overflow-hidden bg-card hover:cursor-pointer hover:shadow-md transition-shadow',
        className,
      )}
      ref={card.ref}
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

      {/* Content */}
      <div className="p-4 flex flex-col gap-2">
        {/* Category + Date row */}
        <div className="flex items-center justify-between gap-2">
          {showCategories && hasCategories && (
            <span
              className="text-xs font-bold uppercase tracking-wide truncate"
              style={{ color: '#1447e6' }}
            >
              {categories?.map((category, index) => {
                if (typeof category === 'object') {
                  const isLast = index === categories.length - 1
                  return (
                    <Fragment key={index}>
                      {category.title || 'Untitled'}
                      {!isLast && ', '}
                    </Fragment>
                  )
                }
                return null
              })}
            </span>
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
                <span key={i} className="text-xs" style={{ color: '#1447e6' }}>
                  #{tag.title}
                </span>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}
