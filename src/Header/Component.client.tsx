'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

import type { Header } from '@/payload-types'

import { Logo } from '@/components/Logo/Logo'
import { useTransparentHeader } from '@/providers/TransparentHeader'
import { cn } from '@/utilities/ui'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  data: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ data }) => {
  const pathname = usePathname()
  const isPostsPage = /(^|\/)posts(\/|$)/.test(pathname)
  const { transparent } = useTransparentHeader()
  const isTransparent = isPostsPage || transparent

  return (
    <header
      className={cn(
        'relative z-20 bg-transparent',
        !isTransparent && 'border-b border-gray-200/70',
      )}
    >
      <div className="container">
        <div
          className={cn('flex items-center', isTransparent ? 'py-12' : 'py-8 justify-between')}
        >
          <div className={isTransparent ? 'flex-1' : ''}>
            <Link href="/">
              <Logo loading="eager" priority="high" className="invert" />
            </Link>
          </div>
          <HeaderNav data={data} centered={isTransparent} />
        </div>
      </div>
    </header>
  )
}
