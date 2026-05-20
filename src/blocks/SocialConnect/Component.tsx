import React from 'react'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandX,
  IconBrandYoutube,
  IconLink,
} from '@tabler/icons-react'

import type { Social, SocialConnectBlock as Props } from '@/payload-types'

const platformIcon: Record<string, React.ComponentType<{ size?: number }>> = {
  linkedin: IconBrandLinkedin,
  facebook: IconBrandFacebook,
  instagram: IconBrandInstagram,
  youtube: IconBrandYoutube,
  twitter: IconBrandX,
  tiktok: IconBrandTiktok,
  discord: IconBrandDiscord,
}

export const SocialConnectBlock: React.FC<Props & { id?: string }> = async ({ heading }) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({
    collection: 'social',
    sort: 'order',
    limit: 50,
    depth: 0,
  })

  const links = docs as Social[]
  if (links.length === 0) return null

  return (
    <section className="container">
      {heading && (
        <h3 className="mb-6 text-center text-xs font-semibold uppercase tracking-[0.3em] text-muted-foreground">
          {heading}
        </h3>
      )}
      <ul className="flex flex-wrap items-center justify-center gap-4">
        {links.map((social) => {
          const Icon = platformIcon[social.platform] || IconLink
          return (
            <li key={social.id}>
              <a
                href={social.url}
                target="_blank"
                rel="noreferrer"
                aria-label={social.platform}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground transition hover:bg-secondary"
              >
                <Icon size={20} />
              </a>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
