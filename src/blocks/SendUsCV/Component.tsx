import configPromise from '@payload-config'
import { getPayload } from 'payload'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import type { SendUsCVBlock as SendUsCVBlockProps, Media, Social } from '@/payload-types'
import { SendUsCVClient, type SocialItem, type ApplyLabels } from './SendUsCVClient'

export const SendUsCVBlock: React.FC<SendUsCVBlockProps & { id?: string }> = async ({
  heading,
  subtitle,
  cvUrl,
  innovatorLabel,
  innovatorAvatars,
}) => {
  const payload = await getPayload({ config: configPromise })
  const t = await getTranslations('JobDetail')

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

  const applyLabels: ApplyLabels = {
    triggerLabel: t('sendCV.trigger'),
    title: t('sendCV.title'),
    subtitle: t('sendCV.subtitle'),
    fullName: t('apply.fullName'),
    email: t('apply.email'),
    phone: t('apply.phone'),
    position: t('sendCV.position'),
    positionPlaceholder: t('sendCV.positionPlaceholder'),
    experience: t('apply.experience'),
    additionalLink: t('apply.additionalLink'),
    additionalLinkPlaceholder: t('apply.additionalLinkPlaceholder'),
    additionalLinkHint: t('apply.additionalLinkHint'),
    cv: t('apply.cv'),
    cvHint: t('apply.cvHint'),
    cvAttached: t('apply.cvAttached'),
    cvChange: t('apply.cvChange'),
    submit: t('apply.submit'),
    submitting: t('apply.submitting'),
    successTitle: t('apply.successTitle'),
    successBody: t('apply.successBody'),
    close: t('apply.close'),
    required: t('apply.required'),
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
        applyLabels={applyLabels}
      />
    </div>
  )
}
