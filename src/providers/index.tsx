import React from 'react'

import { HeroUIWrapper } from './HeroUI'
import { SmoothScrollProvider } from './SmoothScroll'
import { TransparentHeaderProvider } from './TransparentHeader'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <HeroUIWrapper>
      <TransparentHeaderProvider>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </TransparentHeaderProvider>
    </HeroUIWrapper>
  )
}
