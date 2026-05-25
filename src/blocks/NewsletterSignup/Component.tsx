import type { NewsletterSignupBlock as Props } from '@/payload-types'
import { getTranslations } from 'next-intl/server'
import React from 'react'
import { NewsletterSignupClient } from './Client'

export const NewsletterSignupBlock: React.FC<Props & { id?: string }> = async ({
  eyebrow,
  heading,
  subtitle,
}) => {
  const t = await getTranslations('NewsletterSignup')

  return (
    <NewsletterSignupClient
      eyebrow={eyebrow}
      heading={heading ?? ''}
      subtitle={subtitle}
      labels={{
        emailPlaceholder: t('emailPlaceholder'),
        namePlaceholder: t('namePlaceholder'),
        submit: t('submit'),
        submitting: t('submitting'),
        successTitle: t('successTitle'),
        successBody: t('successBody'),
        privacy: t('privacy'),
        errorEmail: t('errorEmail'),
      }}
    />
  )
}
