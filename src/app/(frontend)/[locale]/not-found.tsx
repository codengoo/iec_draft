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
  const cloudY = useTransform(springY, (v) => v * 5 - 50)

  const wallX = useTransform(springX, (v) => v * 24)
  const wallY = useTransform(springY, (v) => v * 12)

  const signX = useTransform(springX, (v) => v * 38 + 220)
  const signY = useTransform(springY, (v) => v * 20 + 140)

  const mascotX = useTransform(springX, (v) => v * 56 - 75)
  const mascotY = useTransform(springY, (v) => v * 26 + 50)

  const layers = [
    {
      src: '/page_404/cloud.png',
      alt: '',
      x: cloudX,
      y: cloudY,
      delay: 0,
      scale: 0.9,
      // Clouds are far back — very soft, diffuse shadow
      filter: 'drop-shadow(0 12px 18px rgba(40,80,120,0.12))',
    },
    {
      src: '/page_404/wall.png',
      alt: '404 page not found',
      x: wallX,
      y: wallY,
      delay: 0.1,
      scale: 0.7,
      // Heavy stone wall — strong ground shadow + subtle contact shadow
      filter:
        'drop-shadow(6px 22px 32px rgba(30,55,85,0.32)) drop-shadow(0 4px 8px rgba(30,55,85,0.16))',
    },
    {
      src: '/page_404/sign.png',
      alt: 'Oops! Page not found',
      x: signX,
      y: signY,
      delay: 0.2,
      scale: 0.4,
      // Construction sign — medium depth, slightly offset to match wall lighting
      filter: 'drop-shadow(4px 12px 20px rgba(30,55,85,0.30))',
    },
    {
      src: '/page_404/mascot.png',
      alt: 'Lost mascot',
      x: mascotX,
      y: mascotY,
      delay: 0.3,
      scale: 0.8,
      // Mascot is closest — strongest, most defined shadow
      filter:
        'drop-shadow(8px 24px 36px rgba(30,55,85,0.38)) drop-shadow(0 6px 12px rgba(30,55,85,0.18))',
    },
  ]

  return (
    <div
      ref={containerRef}
      className="flex min-h-[calc(100vh+10rem)] -mt-40 flex-col items-center justify-center select-none overflow-hidden"
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
        {layers.map(({ src, alt, x, y, delay, scale, filter }) => (
          <motion.div
            key={src}
            className={cn('absolute inset-0')}
            style={{ x, y, scale: scale ?? 1, filter }}
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
