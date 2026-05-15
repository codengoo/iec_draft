'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

/**
 * Enter-only page transition.
 *
 * We deliberately avoid `<AnimatePresence mode="wait">` because, in App Router,
 * the `children` prop is the same React node reused across route changes —
 * Server Components re-render in place. AnimatePresence + mode="wait" tries to
 * keep the previous wrapper on screen while the new children are already
 * mounted, which on back-navigation can leave a blank frame.
 *
 * Re-keying a single `motion.div` by `pathname` is enough: it remounts on every
 * navigation and runs its enter animation. No exit, no blank screen.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  )
}
