'use client'

import React, { useEffect, useState } from 'react'

import { Modal, ModalBody, ModalContent, ModalHeader, useDisclosure } from '@heroui/react'
import {
  IconBrandFacebook,
  IconBrandLinkedin,
  IconBrandMessenger,
  IconBrandTelegram,
  IconBrandWhatsapp,
  IconBrandX,
  IconCheck,
  IconCopy,
  IconDownload,
  IconMail,
  IconQrcode,
} from '@tabler/icons-react'

import { cn } from '@/utilities/ui'

type Platform = {
  key: string
  label: string
  Icon: React.ComponentType<{ size?: number }>
  buildUrl: (url: string, text: string) => string
  className?: string
}

const platforms: Platform[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    Icon: IconBrandFacebook,
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    className: 'hover:bg-[#1877F2]/10 hover:text-[#1877F2]',
  },
  {
    key: 'x',
    label: 'X',
    Icon: IconBrandX,
    buildUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    className: 'hover:bg-foreground/10',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: IconBrandLinkedin,
    buildUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    className: 'hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]',
  },
  {
    key: 'messenger',
    label: 'Messenger',
    Icon: IconBrandMessenger,
    buildUrl: (url) => `https://www.messenger.com/t/?link=${encodeURIComponent(url)}`,
    className: 'hover:bg-[#0084FF]/10 hover:text-[#0084FF]',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    Icon: IconBrandTelegram,
    buildUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    className: 'hover:bg-[#26A5E4]/10 hover:text-[#26A5E4]',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    Icon: IconBrandWhatsapp,
    buildUrl: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent(text ? `${text} ${url}` : url)}`,
    className: 'hover:bg-[#25D366]/10 hover:text-[#25D366]',
  },
  {
    key: 'email',
    label: 'Email',
    Icon: IconMail,
    buildUrl: (url, text) =>
      `mailto:?subject=${encodeURIComponent(text || 'Check this out')}&body=${encodeURIComponent(url)}`,
    className: 'hover:bg-foreground/10',
  },
]

type Props = {
  /** Optional default text used in the X / Telegram intent body. */
  shareText?: string
  /** Optional className for the trigger button. */
  className?: string
  /** Optional aria-label override for the trigger button. */
  ariaLabel?: string
  /** Optional override URL. If omitted, uses window.location.href. */
  overrideUrl?: string
}

export const ShareWidget: React.FC<Props> = ({
  shareText = '',
  className,
  ariaLabel = 'Share',
  overrideUrl,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [url, setUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (overrideUrl) {
      setUrl(overrideUrl)
    } else if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [overrideUrl])

  const qrSrc = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&margin=8&data=${encodeURIComponent(url)}`
    : ''
  const qrDownloadHref = url
    ? `https://api.qrserver.com/v1/create-qr-code/?size=512x512&margin=12&format=png&data=${encodeURIComponent(url)}`
    : ''

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // clipboard might be blocked in iframe / insecure context — fall back to selection
      const input = document.getElementById('share-widget-link-input') as HTMLInputElement | null
      input?.select()
      document.execCommand?.('copy')
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-sm transition hover:border-primary hover:text-primary',
          className,
        )}
      >
        <IconQrcode size={20} />
      </button>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="md"
        placement="center"
        backdrop="blur"
      >
        <ModalContent>
          {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-lg font-bold">Share this page</span>
                <span className="text-sm font-normal text-muted-foreground">
                  Pick a platform, copy the link, or scan / download the QR code.
                </span>
              </ModalHeader>
              <ModalBody className="pb-6">
                {/* Platforms */}
                <div className="grid grid-cols-4 gap-3 sm:grid-cols-7">
                  {platforms.map(({ key, label, Icon, buildUrl, className }) => (
                    <a
                      key={key}
                      href={url ? buildUrl(url, shareText) : '#'}
                      target={key === 'email' ? undefined : '_blank'}
                      rel="noreferrer"
                      onClick={() => key !== 'email' && setTimeout(onClose, 250)}
                      className={cn(
                        'group flex flex-col items-center gap-1.5 rounded-lg border border-border p-2.5 text-muted-foreground transition',
                        className,
                      )}
                      aria-label={`Share on ${label}`}
                    >
                      <Icon size={22} />
                      <span className="text-[10px] font-medium">{label}</span>
                    </a>
                  ))}
                </div>

                {/* Copy link */}
                <div className="mt-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Page link
                  </label>
                  <div className="flex items-stretch gap-2">
                    <input
                      id="share-widget-link-input"
                      type="text"
                      readOnly
                      value={url}
                      className="min-w-0 flex-1 truncate rounded-md border border-border bg-muted px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <button
                      type="button"
                      onClick={handleCopy}
                      className={cn(
                        'inline-flex shrink-0 items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition',
                        copied
                          ? 'bg-success/20 text-success'
                          : 'bg-primary text-primary-foreground hover:opacity-90',
                      )}
                    >
                      {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* QR code */}
                <div className="mt-2 flex flex-col items-center gap-3 rounded-lg border border-border bg-card p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Scan to open
                  </p>
                  <div className="overflow-hidden rounded-md bg-white p-2 shadow-sm">
                    {qrSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={qrSrc} alt="QR code" width={200} height={200} />
                    ) : (
                      <div className="h-[200px] w-[200px] animate-pulse bg-muted" />
                    )}
                  </div>
                  <a
                    href={qrDownloadHref}
                    download="iec-share-qr.png"
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <IconDownload size={16} /> Download PNG
                  </a>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
