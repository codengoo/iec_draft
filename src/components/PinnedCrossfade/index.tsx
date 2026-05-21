'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import React, { useEffect, useRef, useState } from 'react'

type PinnedCrossfadeProps = {
  first: React.ReactNode
  second: React.ReactNode
}

/**
 * Pins the viewport while crossfading two sections in place.
 *
 * Desktop (≥1024px) + motion allowed:
 *   Outer runway is 250vh tall. A sticky inner viewport holds both children
 *   layered absolutely. As the user scrolls past, the first child fades-out /
 *   scales-down / blurs and the second child fades-in / scales-from-1.08 /
 *   unblurs — giving the feeling that only the content changes, the position
 *   stays put.
 *
 * Mobile or reduced-motion:
 *   Pass-through — children stack normally with no transforms.
 *
 * Implementation note: we always render the same DOM tree so the ref stays
 * attached from the first render (framer-motion's useScroll errors if the
 * target ref is defined but never hydrated). We only toggle styles based on
 * the `enabled` flag.
 */
export const PinnedCrossfade: React.FC<PinnedCrossfadeProps> = ({ first, second }) => {
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

  const firstOpacity = useTransform(progress, [0, 0.45, 0.6], [1, 1, 0])
  const firstScale = useTransform(progress, [0, 0.45, 0.6], [1, 1, 0.9])
  const firstFilter = useTransform(progress, [0, 0.45, 0.6], [
    'blur(0px)',
    'blur(0px)',
    'blur(10px)',
  ])

  const secondOpacity = useTransform(progress, [0.45, 0.65, 1], [0, 1, 1])
  const secondScale = useTransform(progress, [0.45, 0.65, 1], [1.08, 1, 1])
  const secondFilter = useTransform(progress, [0.45, 0.65, 1], [
    'blur(10px)',
    'blur(0px)',
    'blur(0px)',
  ])

  const enabled = isDesktop && !reduced

  return (
    <div
      ref={containerRef}
      className={enabled ? 'relative h-[250vh]' : 'relative'}
    >
      <div
        className={
          enabled ? 'sticky top-0 h-screen overflow-hidden' : 'relative'
        }
      >
        <motion.div
          className={enabled ? 'absolute inset-0' : 'relative'}
          style={
            enabled
              ? {
                  opacity: firstOpacity,
                  scale: firstScale,
                  filter: firstFilter,
                  willChange: 'opacity, transform, filter',
                }
              : undefined
          }
        >
          {first}
        </motion.div>
        <motion.div
          className={enabled ? 'absolute inset-0' : 'relative'}
          style={
            enabled
              ? {
                  opacity: secondOpacity,
                  scale: secondScale,
                  filter: secondFilter,
                  willChange: 'opacity, transform, filter',
                }
              : undefined
          }
        >
          {second}
        </motion.div>
      </div>
    </div>
  )
}
