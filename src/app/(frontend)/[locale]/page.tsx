import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import { homeStatic } from '@/endpoints/seed/home-static'
import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload, type RequiredDataFromCollectionSlug } from 'payload'
import { cache } from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './[slug]/page.client'

type Args = {
  params: Promise<{ locale: string }>
}

export default async function HomePage({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { locale } = await paramsPromise
  const url = '/'

  let page: RequiredDataFromCollectionSlug<'pages'> | null

  page = await queryHomePageBySlug(locale)

  if (!page) {
    page = homeStatic
  }

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  const { hero, layout } = page

  return (
    <article className="pt-16 pb-24">
      <PageClient />
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...hero} />
      <RenderBlocks blocks={layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { locale } = await paramsPromise
  const page = await queryHomePageBySlug(locale)
  return generateMeta({ doc: page })
}

const queryHomePageBySlug = cache(async (locale: string) => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'pages',
    draft,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    locale: locale as 'en' | 'vi',
    where: {
      slug: {
        equals: 'home',
      },
    },
  })

  return result.docs?.[0] || null
})
