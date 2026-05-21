'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

import { SectionBackground } from '@/components/SectionBackground'

type PinnedCrossfadeProps = {
  firstLeft: React.ReactNode
  firstRight: React.ReactNode
  secondLeft: React.ReactNode
  secondRight: React.ReactNode

  /** Grid placement classes for each slot. Defaults match VM (5+7) and CV (7+5). */
  firstLeftClassName?: string
  firstRightClassName?: string
  secondLeftClassName?: string
  secondRightClassName?: string
}

/**
 * Pins the viewport while two paired sections swap with a staggered slide-up.
 *
 * Choreography on scrollYProgress 0→1:
 *   - 0.00 → 0.20: idle (first fully visible)
 *   - 0.20 → 0.55: RIGHT zone swap — first.right slides up + fades + blurs out,
 *                                    second.right slides up + fades + unblurs in
 *   - 0.45 → 0.80: LEFT zone swap (overlaps right tail [0.45..0.55])
 *   - 0.80 → 1.00: idle (second fully visible)
 *
 * Background (`<SectionBackground />`) is rendered once at the wrapper level
 * and stays absolutely static during the transition — so only the content
 * morphs, not the surrounding decor.
 *
 * Desktop (≥1024px) + motion allowed only. Mobile / reduced-motion: pass-
 * through (each side stacked normally so each block's standalone bg still
 * shows when consumed separately upstream).
 */
export const PinnedCrossfade: React.FC<PinnedCrossfadeProps> = ({
  firstLeft,
  firstRight,
  secondLeft,
  secondRight,
  firstLeftClassName = 'lg:col-span-5',
  firstRightClassName = 'lg:col-span-7 lg:grid lg:grid-cols-7 lg:gap-8 lg:items-center',
  secondLeftClassName = 'lg:col-span-7',
  secondRightClassName = 'lg:col-span-5 lg:col-start-8',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()

  const [isDesktop, setIsDesktop] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)')
    const update = () => setIsDesktop(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.5 })

  // Phase 1 — RIGHT swap (progress 0.20 → 0.55)
  const firstRightY = useTransform(progress, [0.2, 0.55], [0, -80])
  const firstRightOpacity = useTransform(progress, [0.2, 0.55], [1, 0])
  const firstRightFilter = useTransform(progress, [0.2, 0.55], ['blur(0px)', 'blur(6px)'])

  const secondRightY = useTransform(progress, [0.2, 0.55], [80, 0])
  const secondRightOpacity = useTransform(progress, [0.2, 0.55], [0, 1])
  const secondRightFilter = useTransform(progress, [0.2, 0.55], ['blur(6px)', 'blur(0px)'])

  // Phase 2 — LEFT swap (progress 0.45 → 0.80) — overlaps right tail [0.45..0.55]
  const firstLeftY = useTransform(progress, [0.45, 0.8], [0, -80])
  const firstLeftOpacity = useTransform(progress, [0.45, 0.8], [1, 0])
  const firstLeftFilter = useTransform(progress, [0.45, 0.8], ['blur(0px)', 'blur(6px)'])

  const secondLeftY = useTransform(progress, [0.45, 0.8], [80, 0])
  const secondLeftOpacity = useTransform(progress, [0.45, 0.8], [0, 1])
  const secondLeftFilter = useTransform(progress, [0.45, 0.8], ['blur(6px)', 'blur(0px)'])

  // Pointer-events follow opacity so the invisible layer doesn't block the
  // visible one. Threshold 0.5 → whichever side is more opaque captures input.
  const toPointer = (v: number) => (v > 0.5 ? 'auto' : 'none')
  const firstLeftPointer = useTransform(firstLeftOpacity, toPointer)
  const firstRightPointer = useTransform(firstRightOpacity, toPointer)
  const secondLeftPointer = useTransform(secondLeftOpacity, toPointer)
  const secondRightPointer = useTransform(secondRightOpacity, toPointer)

  const enabled = isDesktop && !reduced

  // ───────────────────────────────────────────────────────────
  // Disabled (mobile / reduced-motion) → stack each pair normally
  // ───────────────────────────────────────────────────────────
  if (!enabled) {
    return (
      <div ref={containerRef} className="relative">
        <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-sky-50/60 via-background to-background py-20 lg:py-28">
          <SectionBackground />
          <div className="container relative w-full">
            <div className="grid grid-cols-1 items-center gap-10">
              {firstLeft}
              <div className="grid grid-cols-1 items-center gap-6">{firstRight}</div>
            </div>
          </div>
        </section>
        <section className="relative flex min-h-screen items-center overflow-hidden bg-linear-to-b from-sky-50/60 via-background to-background py-20 lg:py-28">
          <SectionBackground />
          <div className="container relative w-full">
            <div className="grid grid-cols-1 items-center gap-12">
              {secondLeft}
              {secondRight}
            </div>
          </div>
        </section>
      </div>
    )
  }

  // ───────────────────────────────────────────────────────────
  // Enabled — pinned staggered slide-up
  // ───────────────────────────────────────────────────────────
  return (
    <div ref={containerRef} className="relative h-[250vh]">
      <div className="sticky top-0 h-screen overflow-hidden">
        <section className="relative flex h-full items-center bg-linear-to-b from-sky-50/60 via-background to-background">
          {/* Static shared background */}
          <SectionBackground />

          {/* Both section grids superimposed via absolute positioning */}
          <div className="container relative h-full w-full">
            {/* FIRST section grid (VisionMission) */}
            <div className="absolute inset-0 grid grid-cols-12 items-center gap-8">
              <motion.div
                className={firstLeftClassName}
                style={{
                  y: firstLeftY,
                  opacity: firstLeftOpacity,
                  filter: firstLeftFilter,
                  pointerEvents: firstLeftPointer,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {firstLeft}
              </motion.div>
              <motion.div
                className={firstRightClassName}
                style={{
                  y: firstRightY,
                  opacity: firstRightOpacity,
                  filter: firstRightFilter,
                  pointerEvents: firstRightPointer,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {firstRight}
              </motion.div>
            </div>

            {/* SECOND section grid (CoreValues) */}
            <div className="absolute inset-0 grid grid-cols-12 items-center gap-10">
              <motion.div
                className={secondLeftClassName}
                style={{
                  y: secondLeftY,
                  opacity: secondLeftOpacity,
                  filter: secondLeftFilter,
                  pointerEvents: secondLeftPointer,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {secondLeft}
              </motion.div>
              <motion.div
                className={secondRightClassName}
                style={{
                  y: secondRightY,
                  opacity: secondRightOpacity,
                  filter: secondRightFilter,
                  pointerEvents: secondRightPointer,
                  willChange: 'transform, opacity, filter',
                }}
              >
                {secondRight}
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
