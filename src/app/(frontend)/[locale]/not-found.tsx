'use client'

import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useCallback, useEffect, useRef } from 'react'

import { Button } from '@/components/ui/button'
import { useTransparentHeader } from '@/providers/TransparentHeader'
import { cn } from '@/utilities/ui'

export default function NotFound() {
  const t = useTranslations('NotFound')

  const containerRef = useRef<HTMLDivElement>(null)
  const { setTransparent } = useTransparentHeader()

  useEffect(() => {
    setTransparent(true)
    return () => setTransparent(false)
  }, [setTransparent])

  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)

  const springX = useSpring(rawX, { stiffness: 55, damping: 18 })
  const springY = useSpring(rawY, { stiffness: 55, damping: 18 })

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1
      rawX.set(x)
      rawY.set(y)
    },
    [rawX, rawY],
  )

  const handleMouseLeave = useCallback(() => {
    rawX.set(0)
    rawY.set(0)
  }, [rawX, rawY])

  // Parallax depths — larger multiplier = closer layer = more movement
  const cloudX = useTransform(springX, (v) => v * 10)
  const cloudY = useTransform(springY, (v) => v * 5)

  const wallX = useTransform(springX, (v) => v * 24)
  const wallY = useTransform(springY, (v) => v * 12)

  const signX = useTransform(springX, (v) => v * 38 + 200)
  const signY = useTransform(springY, (v) => v * 18 + 110)

  const mascotX = useTransform(springX, (v) => v * 56)
  const mascotY = useTransform(springY, (v) => v * 26)

  const ctaX = useTransform(springX, (v) => v * -5)
  const ctaY = useTransform(springY, (v) => v * -3)

  const layers = [
    { src: '/page_404/cloud.png', alt: '', x: cloudX, y: cloudY, delay: 0, scale: 1.05 },
    {
      src: '/page_404/wall.png',
      alt: '404 page not found',
      x: wallX,
      y: wallY,
      delay: 0.1,
      scale: 0.7,
    },
    {
      src: '/page_404/sign.png',
      alt: 'Oops! Page not found',
      x: signX,
      y: signY,
      delay: 0.2,
      scale: 0.4,
    },
    {
      src: '/page_404/mascot.png',
      alt: 'Lost mascot',
      x: mascotX,
      y: mascotY,
      delay: 0.3,
      scale: 0.8,
    },
  ]

  return (
    <div
      ref={containerRef}
      className="flex min-h-[calc(100vh-140px)] flex-col items-center justify-center select-none overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #A8D4EE 0%, #C8E6F5 55%, #DFF1FA 100%)' }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {/* ── Parallax scene ─────────────────────────────────────────────────
          All source PNGs share a 1280×854 canvas so they stack pixel-perfectly.
          scale:1.05 provides edge buffer for the parallax shift.
      ──────────────────────────────────────────────────────────────────── */}
      <div
        className="relative w-full overflow-hidden"
        style={{ maxWidth: 1100, aspectRatio: '1280 / 854' }}
      >
        {layers.map(({ src, alt, x, y, delay, scale }) => (
          <motion.div
            key={src}
            className={cn('absolute inset-0')}
            style={{ x, y, scale: scale ?? 1 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay }}
          >
            <Image
              src={src}
              alt={alt}
              fill
              className="object-contain"
              priority={delay === 0}
              draggable={true}
            />
          </motion.div>
        ))}
      </div>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <motion.div
        className="flex flex-col items-center gap-3 mt-1 pb-8"
        style={{ x: ctaX, y: ctaY }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <p className="text-sm text-[#3a6680]">{t('description')}</p>
        <Button asChild size="lg">
          <Link href="/">{t('goHome')}</Link>
        </Button>
      </motion.div>
    </div>
  )
}
