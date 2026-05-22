'use client'

import React from 'react'
import { IconShare3 } from '@tabler/icons-react'

import { Button } from '@/components/ui/button'
import { ShareWidget, type SharePlatformKey } from '@/components/ShareWidget'

type Props = {
  label: string
  shareText?: string
  enabledPlatforms?: SharePlatformKey[]
  qrLogo?: string | null
  className?: string
}

/**
 * Server-component-friendly variant of ShareWidget that renders a full-width
 * outline button as the trigger. Use this from server components where
 * passing the `renderTrigger` render prop directly is not allowed.
 */
export const ShareButtonOutline: React.FC<Props> = ({
  label,
  shareText,
  enabledPlatforms,
  qrLogo,
  className,
}) => {
  return (
    <ShareWidget
      shareText={shareText}
      ariaLabel={label}
      enabledPlatforms={enabledPlatforms}
      qrLogo={qrLogo}
      renderTrigger={({ onOpen, ariaLabel }) => (
        <Button
          type="button"
          onClick={onOpen}
          aria-label={ariaLabel}
          className={className ?? 'w-full'}
          size="lg"
          variant="outline"
        >
          <IconShare3 size={18} />
          {label}
        </Button>
      )}
    />
  )
}
