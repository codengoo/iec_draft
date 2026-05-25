import React from 'react'

import { SearchModal } from '@/components/SearchModal'
import { HeroUIWrapper } from './HeroUI'
import { SearchModalProvider } from './SearchModal'
import { SmoothScrollProvider } from './SmoothScroll'
import { TransparentHeaderProvider } from './TransparentHeader'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <HeroUIWrapper>
      <SearchModalProvider>
        <TransparentHeaderProvider>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </TransparentHeaderProvider>
        <SearchModal />
      </SearchModalProvider>
    </HeroUIWrapper>
  )
}
