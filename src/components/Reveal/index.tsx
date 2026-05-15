'use client'

import { motion, useReducedMotion, type Variants } from 'framer-motion'
import React from 'react'

type Direction = 'up' | 'down' | 'left' | 'right' | 'none'

type Props = {
  children: React.ReactNode
  /** Direction the element travels FROM toward final position. */
  direction?: Direction
  /** Distance in px to travel from. Default 24. */
  distance?: number
  /** Animation duration in seconds. Default 0.6. */
  duration?: number
  /** Delay in seconds before animation starts. Default 0. */
  delay?: number
  /** Margin around the viewport for `whileInView`. Default '-80px'. */
  margin?: string
  /** Only animate once. Default true. */
  once?: boolean
  /** Optional wrapper className. */
  className?: string
  /** Render as which element. Default 'div'. */
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'main' | 'span'
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1]

function offsetFor(direction: Direction, distance: number) {
  switch (direction) {
    case 'up':
      return { x: 0, y: distance }
    case 'down':
      return { x: 0, y: -distance }
    case 'left':
      return { x: distance, y: 0 }
    case 'right':
      return { x: -distance, y: 0 }
    case 'none':
    default:
      return { x: 0, y: 0 }
  }
}

export function Reveal({
  children,
  direction = 'up',
  distance = 24,
  duration = 0.6,
  delay = 0,
  margin = '-80px',
  once = true,
  className,
  as = 'div',
}: Props) {
  const reduced = useReducedMotion()
  const offset = offsetFor(direction, distance)

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: { opacity: 1, x: 0, y: 0 },
  }

  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as] as typeof motion.div

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={variants}
      transition={{ duration, delay, ease: EASE }}
    >
      {children}
    </MotionTag>
  )
}

/**
 * Staggers children — wrap a group of items, and each direct child fades in sequentially.
 * Children should be wrapped in <RevealItem>.
 */
export function RevealGroup({
  children,
  stagger = 0.08,
  delayStart = 0,
  margin = '-80px',
  once = true,
  className,
  as = 'div',
}: {
  children: React.ReactNode
  stagger?: number
  delayStart?: number
  margin?: string
  once?: boolean
  className?: string
  as?: 'div' | 'section' | 'article' | 'header' | 'aside' | 'main' | 'span'
}) {
  const reduced = useReducedMotion()
  if (reduced) {
    const Tag = as
    return <Tag className={className}>{children}</Tag>
  }

  const MotionTag = motion[as] as typeof motion.div
  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, margin }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delayStart },
        },
      }}
    >
      {children}
    </MotionTag>
  )
}

export function RevealItem({
  children,
  direction = 'up',
  distance = 18,
  duration = 0.55,
  className,
}: {
  children: React.ReactNode
  direction?: Direction
  distance?: number
  duration?: number
  className?: string
}) {
  const reduced = useReducedMotion()
  if (reduced) return <div className={className}>{children}</div>

  const offset = offsetFor(direction, distance)
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        visible: { opacity: 1, x: 0, y: 0, transition: { duration, ease: EASE } },
      }}
    >
      {children}
    </motion.div>
  )
}
