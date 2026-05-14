import type { Metadata } from 'next/types'

import { Card } from '@/components/Card'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import { FeaturedPost } from './FeaturedPost'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

export default async function Page() {
  const payload = await getPayload({ config: configPromise })

  const posts = await payload.find({
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
  })

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

      {/* Latest posts grid */}
      {restPosts.length > 0 && (
        <div className="container">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-5 rounded-full" style={{ backgroundColor: '#1447e6' }} />
            <h2 className="text-xs font-bold uppercase tracking-widest text-foreground">
              Cập nhật mới nhất
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {restPosts.map((post, index) => (
              <Card key={index} doc={post} relationTo="posts" showCategories />
            ))}
          </div>

          {posts.totalDocs > 13 && (
            <div className="flex justify-center mt-12">
              <Link
                href="/posts/page/2"
                className="border text-foreground px-10 py-3 text-xs font-bold uppercase tracking-widest hover:bg-muted transition-colors rounded"
                style={{ borderColor: '#1447e6', color: '#1447e6' }}
              >
                Xem thêm tin tức
              </Link>
            </div>
          )}
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
