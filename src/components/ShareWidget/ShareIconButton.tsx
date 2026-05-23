'use client'

import React from 'react'
import { IconShare3 } from '@tabler/icons-react'

import { ShareWidget, type SharePlatformKey } from '@/components/ShareWidget'
import { cn } from '@/utilities/ui'

type Props = {
  shareText?: string
  ariaLabel?: string
  enabledPlatforms?: SharePlatformKey[]
  qrLogo?: string | null
  className?: string
  /** Visual tone — `light` reads on dark backgrounds, `dark` on light ones. */
  tone?: 'light' | 'dark'
  /** Tabler icon size in px. Default 18. */
  iconSize?: number
}

/**
 * Compact circular icon button trigger for ShareWidget — server-component
 * friendly (no `renderTrigger` function leaves the boundary). Use inline with
 * meta rows (e.g. next to a post's published date).
 */
export const ShareIconButton: React.FC<Props> = ({
  shareText,
  ariaLabel,
  enabledPlatforms,
  qrLogo,
  className,
  tone = 'dark',
  iconSize = 18,
}) => {
  return (
    <ShareWidget
      shareText={shareText}
      ariaLabel={ariaLabel}
      enabledPlatforms={enabledPlatforms}
      qrLogo={qrLogo}
      renderTrigger={({ onOpen, ariaLabel: aria }) => (
        <button
          type="button"
          onClick={onOpen}
          aria-label={aria}
          className={cn(
            'inline-flex h-9 w-9 items-center justify-center rounded-full border transition',
            tone === 'light'
              ? 'border-white/30 text-white/90 hover:bg-white/15 hover:text-white'
              : 'border-border text-foreground/70 hover:bg-foreground/5 hover:text-foreground',
            className,
          )}
        >
          <IconShare3 size={iconSize} />
        </button>
      )}
    />
  )
}
