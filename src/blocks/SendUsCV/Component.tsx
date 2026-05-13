import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'
import type { SendUsCVBlock as SendUsCVBlockProps, Media, Social } from '@/payload-types'
import { SendUsCVClient, type SocialItem } from './SendUsCVClient'

export const SendUsCVBlock: React.FC<SendUsCVBlockProps & { id?: string }> = async ({
  heading,
  subtitle,
  cvUrl,
  innovatorLabel,
  innovatorAvatars,
}) => {
  const payload = await getPayload({ config: configPromise })

  const { docs: socialDocs } = await payload.find({
    collection: 'social',
    limit: 20,
    depth: 0,
    sort: 'order',
  })

  const socials: SocialItem[] = (socialDocs as Social[]).map((doc) => ({
    id: String(doc.id),
    platform: doc.platform,
    url: doc.url,
  }))

  const avatarUrls: string[] = []
  if (innovatorAvatars?.length) {
    for (const item of innovatorAvatars) {
      if (item.avatar && typeof item.avatar === 'object') {
        const media = item.avatar as Media
        if (media.url) avatarUrls.push(media.url)
      }
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4">
      <SendUsCVClient
        heading={heading ?? undefined}
        subtitle={subtitle ?? undefined}
        cvUrl={cvUrl ?? undefined}
        innovatorLabel={innovatorLabel ?? undefined}
        avatarUrls={avatarUrls}
        socials={socials}
      />
    </div>
  )
}
