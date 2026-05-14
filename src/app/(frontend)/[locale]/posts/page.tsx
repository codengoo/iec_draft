import type { Metadata } from 'next/types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { FeaturedPost } from './FeaturedPost'
import PageClient from './page.client'
import { PostsGrid } from './PostsGrid'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const [posts, categories] = await Promise.all([
    payload.find({
      collection: 'posts',
      depth: 1,
      limit: 13,
      overrideAccess: false,
      sort: '-publishedAt',
      select: {
        title: true,
        slug: true,
        categories: true,
        tags: true,
        meta: true,
        publishedAt: true,
        heroImage: true,
      },
    }),
    payload.find({
      collection: 'categories',
      limit: 100,
      depth: 0,
      sort: 'title',
      select: { title: true },
    }),
  ])

  const [featuredPost, ...restPosts] = posts.docs

  return (
    <div className="pt-24 pb-24">
      <PageClient />

      {/* Featured Post */}
      {featuredPost && (
        <div className="container mb-16">
          <FeaturedPost post={featuredPost} />
        </div>
      )}

      {/* Latest posts grid with category filter */}
      {restPosts.length > 0 && (
        <div className="container">
          <PostsGrid
            initialPosts={restPosts}
            initialTotal={posts.totalDocs}
            categories={categories.docs.map((c) => ({ id: c.id, title: c.title }))}
          />
        </div>
      )}
    </div>
  )
}

export function generateMetadata(): Metadata {
  return {
    title: `Posts`,
  }
}
