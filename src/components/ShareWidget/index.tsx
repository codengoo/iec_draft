'use client'

import React, { useEffect, useMemo, useRef, useState } from 'react'

import { Modal, ModalBody, ModalContent, ModalHeader, addToast, useDisclosure } from '@heroui/react'
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
import { useTranslations } from 'next-intl'

import { cn } from '@/utilities/ui'

export type SharePlatformKey =
  | 'facebook'
  | 'x'
  | 'linkedin'
  | 'messenger'
  | 'telegram'
  | 'whatsapp'
  | 'email'

export type QrColorPreset = 'mono' | 'iecIndigo' | 'instagram' | 'sunset' | 'ocean' | 'forest'

type PlatformDef = {
  key: SharePlatformKey
  label: string
  Icon: React.ComponentType<{ size?: number }>
  buildUrl: (url: string, text: string) => string
  /** brand-tinted hover class */
  hoverClass: string
}

const PLATFORMS: PlatformDef[] = [
  {
    key: 'facebook',
    label: 'Facebook',
    Icon: IconBrandFacebook,
    buildUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    hoverClass: 'hover:border-[#1877F2] hover:text-[#1877F2] hover:bg-[#1877F2]/5',
  },
  {
    key: 'x',
    label: 'X',
    Icon: IconBrandX,
    buildUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    hoverClass: 'hover:border-foreground hover:text-foreground hover:bg-foreground/5',
  },
  {
    key: 'linkedin',
    label: 'LinkedIn',
    Icon: IconBrandLinkedin,
    buildUrl: (url) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    hoverClass: 'hover:border-[#0A66C2] hover:text-[#0A66C2] hover:bg-[#0A66C2]/5',
  },
  {
    key: 'messenger',
    label: 'Messenger',
    Icon: IconBrandMessenger,
    buildUrl: (url) => `https://www.messenger.com/t/?link=${encodeURIComponent(url)}`,
    hoverClass: 'hover:border-[#0084FF] hover:text-[#0084FF] hover:bg-[#0084FF]/5',
  },
  {
    key: 'telegram',
    label: 'Telegram',
    Icon: IconBrandTelegram,
    buildUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
    hoverClass: 'hover:border-[#26A5E4] hover:text-[#26A5E4] hover:bg-[#26A5E4]/5',
  },
  {
    key: 'whatsapp',
    label: 'WhatsApp',
    Icon: IconBrandWhatsapp,
    buildUrl: (url, text) =>
      `https://wa.me/?text=${encodeURIComponent(text ? `${text} ${url}` : url)}`,
    hoverClass: 'hover:border-[#25D366] hover:text-[#25D366] hover:bg-[#25D366]/5',
  },
  {
    key: 'email',
    label: 'Email',
    Icon: IconMail,
    buildUrl: (url, text) =>
      `mailto:?subject=${encodeURIComponent(text || 'Check this out')}&body=${encodeURIComponent(url)}`,
    hoverClass: 'hover:border-foreground hover:text-foreground hover:bg-foreground/5',
  },
]

type QrPresetConfig = {
  type: 'solid' | 'gradient'
  /** for solid */
  color?: string
  /** for gradient */
  colorStops?: { offset: number; color: string }[]
  rotation?: number
}

const QR_PRESETS: Record<QrColorPreset, QrPresetConfig> = {
  mono: { type: 'solid', color: '#000000' },
  iecIndigo: { type: 'solid', color: '#3730A3' },
  instagram: {
    type: 'gradient',
    rotation: Math.PI / 4,
    colorStops: [
      { offset: 0, color: '#F58529' },
      { offset: 0.4, color: '#DD2A7B' },
      { offset: 0.75, color: '#8134AF' },
      { offset: 1, color: '#515BD4' },
    ],
  },
  sunset: {
    type: 'gradient',
    rotation: 0,
    colorStops: [
      { offset: 0, color: '#F97316' },
      { offset: 1, color: '#DC2626' },
    ],
  },
  ocean: {
    type: 'gradient',
    rotation: Math.PI / 6,
    colorStops: [
      { offset: 0, color: '#06B6D4' },
      { offset: 1, color: '#1D4ED8' },
    ],
  },
  forest: {
    type: 'gradient',
    rotation: 0,
    colorStops: [
      { offset: 0, color: '#0D9488' },
      { offset: 1, color: '#16A34A' },
    ],
  },
}

function buildQrColorOptions(preset: QrPresetConfig) {
  if (preset.type === 'solid') return { color: preset.color }
  return {
    gradient: {
      type: 'linear' as const,
      rotation: preset.rotation ?? 0,
      colorStops: preset.colorStops!,
    },
  }
}

/** CSS background used for the swatch preview button in the picker row. */
function swatchBackground(preset: QrPresetConfig): string {
  if (preset.type === 'solid') return preset.color ?? '#000000'
  const stops = preset.colorStops ?? []
  // Convert qr-code-styling rotation (radians) into CSS deg offset from "to right" (0rad ≈ 90deg)
  const deg = Math.round(90 + ((preset.rotation ?? 0) * 180) / Math.PI)
  const parts = stops.map((s) => `${s.color} ${Math.round(s.offset * 100)}%`).join(', ')
  return `linear-gradient(${deg}deg, ${parts})`
}

const PRESET_ORDER: QrColorPreset[] = ['mono', 'iecIndigo', 'instagram', 'sunset', 'ocean', 'forest']

type Props = {
  /** Default text used in X / Telegram / WhatsApp intent bodies. */
  shareText?: string
  /** Platforms to expose; defaults to all. */
  enabledPlatforms?: SharePlatformKey[]
  /** Image URL rendered at the centre of the QR code. */
  qrLogo?: string | null
  /** Optional URL override (defaults to window.location.href). */
  overrideUrl?: string
  /** Initial QR colour preset (visitor can still change it inside the popup). */
  initialQrPreset?: QrColorPreset
  className?: string
  ariaLabel?: string
}

export const ShareWidget: React.FC<Props> = ({
  shareText = '',
  enabledPlatforms,
  qrLogo,
  initialQrPreset = 'iecIndigo',
  overrideUrl,
  className,
  ariaLabel,
}) => {
  const t = useTranslations('Share')
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure()
  const [url, setUrl] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<QrColorPreset>(initialQrPreset)
  const qrContainerRef = useRef<HTMLDivElement | null>(null)
  const qrInstanceRef = useRef<any>(null)

  const activePlatforms = useMemo(() => {
    if (!enabledPlatforms || enabledPlatforms.length === 0) return PLATFORMS
    return PLATFORMS.filter((p) => enabledPlatforms.includes(p.key))
  }, [enabledPlatforms])

  // Get current URL on mount
  useEffect(() => {
    if (overrideUrl) {
      setUrl(overrideUrl)
    } else if (typeof window !== 'undefined') {
      setUrl(window.location.href)
    }
  }, [overrideUrl])

  // Initialise / update QR code instance whenever inputs change.
  // Lazy-import qr-code-styling so SSR doesn't pull it in.
  useEffect(() => {
    if (!isOpen || !url) return

    let cancelled = false

    ;(async () => {
      try {
        const QRCodeStyling = (await import('qr-code-styling')).default
        if (cancelled) return

        const preset = QR_PRESETS[selectedPreset]
        const colorOptions = buildQrColorOptions(preset)

        const opts = {
          width: 240,
          height: 240,
          type: 'svg' as const,
          data: url,
          margin: 8,
          image: qrLogo || undefined,
          imageOptions: {
            crossOrigin: 'anonymous',
            margin: 6,
            imageSize: 0.28,
            hideBackgroundDots: true,
          },
          dotsOptions: { ...colorOptions, type: 'rounded' as const },
          cornersSquareOptions: { ...colorOptions, type: 'extra-rounded' as const },
          cornersDotOptions: { ...colorOptions, type: 'dot' as const },
          backgroundOptions: { color: '#ffffff' },
        }

        if (qrInstanceRef.current) {
          qrInstanceRef.current.update(opts)
        } else {
          qrInstanceRef.current = new QRCodeStyling(opts)
          if (qrContainerRef.current) {
            qrContainerRef.current.innerHTML = ''
            qrInstanceRef.current.append(qrContainerRef.current)
          }
        }
      } catch (e) {
        addToast({
          title: t('qrErrorTitle'),
          description: t('qrErrorBody'),
          color: 'danger',
        })
      }
    })()

    return () => {
      cancelled = true
    }
  }, [isOpen, url, qrLogo, selectedPreset, t])

  const handleCopy = async () => {
    if (!url) return
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      addToast({
        title: t('copySuccessTitle'),
        description: t('copySuccessBody'),
        color: 'success',
      })
    } catch {
      const input = document.getElementById('share-widget-link-input') as HTMLInputElement | null
      try {
        input?.select()
        document.execCommand?.('copy')
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        addToast({
          title: t('copySuccessTitle'),
          description: t('copySuccessBody'),
          color: 'success',
        })
      } catch {
        addToast({
          title: t('copyErrorTitle'),
          description: t('copyErrorBody'),
          color: 'danger',
        })
      }
    }
  }

  const handleDownload = async () => {
    if (!qrInstanceRef.current) return
    try {
      await qrInstanceRef.current.download({ name: 'iec-share-qr', extension: 'png' })
      addToast({
        title: t('qrDownloadedTitle'),
        description: t('qrDownloadedBody'),
        color: 'success',
      })
    } catch {
      addToast({
        title: t('qrErrorTitle'),
        description: t('qrErrorBody'),
        color: 'danger',
      })
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={onOpen}
        aria-label={ariaLabel ?? t('trigger')}
        className={cn(
          'inline-flex h-12 w-12 items-center justify-center rounded-full bg-card text-primary shadow-[0_10px_24px_-8px_rgba(0,111,238,0.35)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_16px_30px_-8px_rgba(0,111,238,0.55)]',
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
                <span className="text-lg font-bold">{t('title')}</span>
                <span className="text-sm font-normal text-muted-foreground">{t('subtitle')}</span>
              </ModalHeader>
              <ModalBody className="pb-6">
                {/* Platforms (icon-only, tooltip on hover) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5">
                  {activePlatforms.map(({ key, label, Icon, buildUrl, hoverClass }) => (
                    <a
                      key={key}
                      href={url ? buildUrl(url, shareText) : '#'}
                      target={key === 'email' ? undefined : '_blank'}
                      rel="noreferrer"
                      onClick={() => key !== 'email' && setTimeout(onClose, 250)}
                      title={label}
                      aria-label={label}
                      className={cn(
                        'inline-flex h-11 w-11 items-center justify-center rounded-xl border border-border text-muted-foreground transition',
                        hoverClass,
                      )}
                    >
                      <Icon size={20} />
                    </a>
                  ))}
                </div>

                {/* Copy link */}
                <div className="mt-2">
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('pageLink')}
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
                      {copied ? t('copied') : t('copy')}
                    </button>
                  </div>
                </div>

                {/* QR style picker + QR code */}
                <div className="mt-2 flex flex-col items-center gap-4 rounded-lg border border-border bg-card p-4">
                  {/* Preset picker — above QR */}
                  <div className="flex w-full flex-col items-center gap-2.5">
                    <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {t('qrStyle')}
                    </span>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                      {PRESET_ORDER.map((key) => {
                        const isActive = selectedPreset === key
                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedPreset(key)}
                            title={t(`presets.${key}` as `presets.${QrColorPreset}`)}
                            aria-label={t(`presets.${key}` as `presets.${QrColorPreset}`)}
                            aria-pressed={isActive}
                            className={cn(
                              'h-8 w-8 rounded-full ring-offset-2 ring-offset-card transition focus:outline-none',
                              isActive
                                ? 'ring-2 ring-primary scale-110'
                                : 'ring-1 ring-border hover:scale-105',
                            )}
                            style={{ background: swatchBackground(QR_PRESETS[key]) }}
                          />
                        )
                      })}
                    </div>
                  </div>

                  <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    {t('scanToOpen')}
                  </p>
                  <div className="overflow-hidden rounded-lg bg-white p-2 shadow-sm">
                    <div
                      ref={qrContainerRef}
                      className="flex h-60 w-60 items-center justify-center"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    <IconDownload size={16} /> {t('downloadPng')}
                  </button>
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
