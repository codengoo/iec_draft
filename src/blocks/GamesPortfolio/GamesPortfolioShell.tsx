'use client'

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from 'framer-motion'
import React, { useRef } from 'react'

type Props = {
  children: React.ReactNode
}

// Wraps the games portfolio in a dark rounded "shelf" that sits inside the
// page (white) background. As the user scrolls through the section, the side
// padding (and corner radius) eases up to a peak at the section's vertical
// midpoint, then eases back down — giving the container a "breathing" feel.
export function GamesPortfolioShell({ children }: Props) {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 22, mass: 0.5 })

  // Peak at progress = 0.5. Values in rem so they scale a little with root font.
  const sidePadding = useTransform(smooth, [0, 0.5, 1], ['0.25rem', '4rem', '0.25rem'])
  const borderRadius = useTransform(smooth, [0, 0.5, 1], ['0.75rem', '2.5rem', '0.75rem'])

  return (
    <section ref={ref} className="relative bg-background py-3 md:py-6">
      <motion.div
        className="relative overflow-hidden"
        style={{
          marginLeft: reduced ? '1.5rem' : sidePadding,
          marginRight: reduced ? '1.5rem' : sidePadding,
          borderRadius: reduced ? '1.5rem' : borderRadius,
          background:
            'radial-gradient(ellipse 80% 60% at 50% 0%, oklch(32% 0.10 260deg) 0%, oklch(18% 0.05 260deg) 70%)',
        }}
      >
        {/* Subtle grid texture */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'linear-gradient(oklch(100% 0 0deg) 1px, transparent 1px), linear-gradient(to right, oklch(100% 0 0deg) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        {/* Glow accent */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-64 w-150 -translate-x-1/2 rounded-full bg-blue-500/20 blur-[80px]"
        />

        <div className="relative z-10 flex w-full flex-col items-center justify-center py-10 md:py-14">
          {children}
        </div>
      </motion.div>
    </section>
  )
}
