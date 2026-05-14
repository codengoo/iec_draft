'use client'

import React from 'react'

import type { Header as HeaderType } from '@/payload-types'

import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { CMSLink } from '@/components/Link'
import { IconSearch } from '@tabler/icons-react'
import Link from 'next/link'

const navLinkClass =
  'relative inline-block px-1 py-1 text-lg font-medium uppercase tracking-wide text-foreground transition-colors hover:text-primary after:absolute after:left-1 after:right-1 after:-bottom-0.5 after:h-0.5 after:bg-primary after:origin-left after:scale-x-0 after:transition-transform after:duration-300 hover:after:scale-x-100'

export const HeaderNav: React.FC<{ data: HeaderType; centered?: boolean }> = ({
  data,
  centered,
}) => {
  const navItems = data?.navItems || []

  const links = navItems.map(({ link }, i) => (
    <CMSLink key={i} {...link} appearance="inline" className={navLinkClass} />
  ))

  if (centered) {
    return (
      <>
        <nav className="flex gap-6 items-center justify-center">{links}</nav>
        <div className="flex-1 flex justify-end items-center gap-3">
          <Link href="/search" aria-label="Search">
            <span className="sr-only">Search</span>
            <IconSearch size={20} className="text-primary" />
          </Link>
          <LanguageSwitcher />
        </div>
      </>
    )
  }

  return (
    <nav className="flex gap-3 items-center">
      {links}
      <Link href="/search">
        <span className="sr-only">Search</span>
        <IconSearch size={20} className="text-primary" />
      </Link>
      <LanguageSwitcher />
    </nav>
  )
}
