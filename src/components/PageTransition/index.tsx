'use client'

import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import React from 'react'

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

export function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const reduced = useReducedMotion()

  if (reduced) {
    return <>{children}</>
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 18, filter: 'blur(6px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
        transition={{ duration: 0.45, ease: EASE }}
        style={{ willChange: 'transform, opacity, filter' }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
