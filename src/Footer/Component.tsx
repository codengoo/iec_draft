import type { Social } from '@/payload-types'
import { getCachedGlobal } from '@/utilities/getGlobals'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { Logo } from '@/components/Logo/Logo'
import { Divider } from '@heroui/react'
import Link from 'next/link'
import {
  IconBrandDiscord,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandTiktok,
  IconBrandTwitter,
  IconBrandYoutube,
  IconPhone,
} from '@tabler/icons-react'

function SocialIcon({ platform }: { platform: Social['platform'] }) {
  const cls = 'w-5 h-5'
  switch (platform) {
    case 'linkedin':
      return <IconBrandLinkedin className={cls} />
    case 'facebook':
      return <IconBrandFacebook className={cls} />
    case 'instagram':
      return <IconBrandInstagram className={cls} />
    case 'youtube':
      return <IconBrandYoutube className={cls} />
    case 'twitter':
      return <IconBrandTwitter className={cls} />
    case 'tiktok':
      return <IconBrandTiktok className={cls} />
    case 'discord':
      return <IconBrandDiscord className={cls} />
    default:
      return null
  }
}

export async function Footer() {
  const [footerData, payload] = await Promise.all([
    getCachedGlobal('footer', 1)(),
    getPayload({ config: configPromise }),
  ])

  const { docs: socialDocs } = await payload.find({
    collection: 'social',
    limit: 20,
    depth: 0,
    sort: 'order',
  })

  const socials = socialDocs as Social[]
  const navItems = footerData?.navItems || []

  return (
    <footer className="mt-auto">
      {/* Top section — company info */}
      {(footerData?.companyName ||
        footerData?.address ||
        footerData?.hotline ||
        footerData?.email) && (
        <div className="bg-primary border-t border-white/10">
          <div className="container py-10 flex flex-col md:flex-row md:items-center gap-8 md:gap-16">
            {/* Company info */}
            <div className="flex-1">
              {footerData.companyName && (
                <p className="font-bold text-sm text-white mb-3">{footerData.companyName}</p>
              )}
              <div className="flex flex-col gap-1 text-sm text-white/80">
                {footerData.address && <p>Trụ sở chính: {footerData.address}</p>}
                {footerData.hotline && <p>Hotline: {footerData.hotline}</p>}
                {footerData.email && <p>Email: {footerData.email}</p>}
              </div>
            </div>
            {/* Logo */}
            <Link href="/" className="shrink-0">
              <Logo className="brightness-0 invert w-48 md:w-64 max-w-none h-auto" />
            </Link>
          </div>
        </div>
      )}

      <Divider className="bg-blue-500" />
      {/* Bottom bar */}
      <div className="bg-primary text-white">
        <div className="container py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Left — copyright + nav links */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-white/75">
            {footerData?.copyright && <span>{footerData.copyright}</span>}
            {footerData?.copyright && navItems.length > 0 && (
              <span className="text-white/40">—</span>
            )}
            {navItems.map(({ link }, i) => (
              <React.Fragment key={i}>
                <CMSLink className="text-white/75 hover:text-white transition-colors" {...link} />
                {i < navItems.length - 1 && <span className="text-white/40">—</span>}
              </React.Fragment>
            ))}
          </div>

          {/* Right — social icons + phone button */}
          <div className="flex items-center gap-4">
            {socials.length > 0 && (
              <div className="flex items-center gap-3">
                {socials.map((s) => (
                  <a
                    key={s.id}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/75 hover:text-white transition-colors"
                    aria-label={s.platform}
                  >
                    <SocialIcon platform={s.platform} />
                  </a>
                ))}
              </div>
            )}

            {footerData?.phone && (
              <a
                href={footerData.phoneUrl ?? `tel:${footerData.phone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/40 text-sm text-white hover:bg-white/15 transition-colors whitespace-nowrap"
              >
                <IconPhone className="w-4 h-4" />
                {footerData.phone}
              </a>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
