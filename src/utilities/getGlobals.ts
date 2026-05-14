import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

type Global = keyof Config['globals']
type Locale = 'en' | 'vi'

async function getGlobal<T extends Global>(
  slug: T,
  depth = 0,
  locale?: Locale,
): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    ...(locale ? { locale } : {}),
  })

  return global
}

/**
 * Returns a unstable_cache function mapped with the cache tag for the slug.
 * Cache is keyed by slug + locale so each locale gets its own entry.
 */
export const getCachedGlobal = <T extends Global>(slug: T, depth = 0, locale?: Locale) =>
  unstable_cache(
    async () => getGlobal<T>(slug, depth, locale),
    [slug, locale ?? 'default'],
    {
      tags: [`global_${slug}`],
    },
  )
