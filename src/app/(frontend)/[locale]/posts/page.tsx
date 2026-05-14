import type { Metadata } from 'next/types'

import { Card } from '@/components/Card'
import { Media } from '@/components/Media'
import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import PageClient from './page.client'

export const dynamic = 'force-static'
export const revalidate = 600

function formatDateDDMMYYYY(timestamp: string): string {
  const date = new Date(timestamp)
  const DD = String(date.getDate()).padStart(2, '0')
  const MM = String(date.getMonth() + 1).padStart(2, '0')
  const YYYY = date.getFullYear()
  return `${DD}.${MM}.${YYYY}`
}

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
          <div className="grid grid-cols-12 rounded-2xl overflow-hidden border border-border">
            {/* Left: hero image */}
            <div className="col-span-7 relative min-h-105 bg-muted">
              {featuredPost.heroImage && typeof featuredPost.heroImage !== 'string' ? (
                <Media
                  fill
                  resource={featuredPost.heroImage}
                  imgClassName="object-cover"
                  priority
                />
              ) : featuredPost.meta?.image && typeof featuredPost.meta.image !== 'string' ? (
                <Media
                  fill
                  resource={featuredPost.meta.image}
                  imgClassName="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">
                  No image
                </div>
              )}
            </div>

            {/* Right: info card */}
            <div className="col-span-5 bg-blue-100 p-10 flex flex-col justify-center gap-4">
              <div className="flex items-center gap-3">
                <span
                  className="text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full"
                  // style={{ backgroundColor: '#1447e620', color: '#1447e6' }}
                >
                  Tin nổi bật
                </span>
                {featuredPost.publishedAt && (
                  <span className="text-sm text-muted-foreground">
                    {formatDateDDMMYYYY(featuredPost.publishedAt)}
                  </span>
                )}
              </div>

              {featuredPost.categories &&
                Array.isArray(featuredPost.categories) &&
                featuredPost.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {featuredPost.categories.map((cat, i) => {
                      if (typeof cat !== 'object') return null
                      return (
                        <span
                          key={i}
                          className="text-xs font-bold uppercase tracking-wide"
                          style={{ color: '#1447e6' }}
                        >
                          {cat.title}
                        </span>
                      )
                    })}
                  </div>
                )}

              <h2 className="text-3xl font-extrabold leading-tight text-foreground">
                {featuredPost.title}
              </h2>

              {featuredPost.meta?.description && (
                <p className="text-muted-foreground line-clamp-4 text-base leading-relaxed">
                  {featuredPost.meta.description}
                </p>
              )}

              <Link
                href={`/posts/${featuredPost.slug}`}
                className="inline-flex items-center gap-2 font-semibold text-sm hover:underline w-fit"
                style={{ color: '#1447e6' }}
              >
                Đọc thêm →
              </Link>
            </div>
          </div>
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
