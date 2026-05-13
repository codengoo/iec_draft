'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  IconBrandLinkedin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandYoutube,
  IconBrandTwitter,
  IconBrandTiktok,
  IconBrandDiscord,
} from '@tabler/icons-react'

export type SocialItem = {
  id: string
  platform: 'linkedin' | 'facebook' | 'instagram' | 'youtube' | 'twitter' | 'tiktok' | 'discord'
  url: string
}

export type SendUsCVProps = {
  heading?: string
  subtitle?: string
  cvUrl?: string
  innovatorLabel?: string
  avatarUrls?: string[]
  socials?: SocialItem[]
}

function SocialIcon({ platform }: { platform: SocialItem['platform'] }) {
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

export function SendUsCVClient({
  heading,
  subtitle,
  cvUrl,
  innovatorLabel,
  avatarUrls = [],
  socials = [],
}: SendUsCVProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-[#0f1729] text-white px-8 py-10 flex flex-col items-center text-center"
    >
      {/* Decorative puzzle icon */}
      <div className="pointer-events-none absolute right-0 bottom-0 opacity-10 select-none">
        <svg
          width="200"
          height="200"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M140 60c0-11 9-20 20-20s20 9 20 20-9 20-20 20h-20V60zM80 140c11 0 20 9 20 20s-9 20-20 20-20-9-20-20v-20h20zM60 80H40c-11 0-20-9-20-20s9-20 20-20 20 9 20 20v20zM120 120v20c0 11 9 20 20 20s20-9 20-20-9-20-20-20h-20zM60 80v60h60V80H60z"
            fill="white"
          />
        </svg>
      </div>

      {heading && <p className="text-sm font-medium text-gray-300 mb-3">{heading}</p>}
      {subtitle && (
        <p className="text-gray-400 text-sm max-w-md leading-relaxed mb-6">{subtitle}</p>
      )}

      {/* CTA Button */}
      <a
        href={cvUrl ?? 'mailto:'}
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-white/30 text-white text-sm font-medium hover:bg-white/10 transition-colors mb-6"
      >
        Send Us Your CV
      </a>

      {/* Social icons */}
      {socials.length > 0 && (
        <div className="flex items-center gap-4 mb-6">
          {socials.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.platform}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <SocialIcon platform={s.platform} />
            </a>
          ))}
        </div>
      )}

      {/* Stacked avatars + innovator label */}
      {(avatarUrls.length > 0 || innovatorLabel) && (
        <div className="flex items-center gap-3">
          {avatarUrls.length > 0 && (
            <div className="flex -space-x-2">
              {avatarUrls.map((url, i) => (
                <img
                  key={i}
                  src={url}
                  alt=""
                  className="w-8 h-8 rounded-full border-2 border-[#0f1729] object-cover"
                  style={{ zIndex: avatarUrls.length - i }}
                />
              ))}
            </div>
          )}
          {innovatorLabel && <span className="text-sm text-gray-300">{innovatorLabel}</span>}
        </div>
      )}
    </motion.div>
  )
}
