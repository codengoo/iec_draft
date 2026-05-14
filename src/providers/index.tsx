import React from 'react'

import { HeroUIWrapper } from './HeroUI'
import { SmoothScrollProvider } from './SmoothScroll'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <HeroUIWrapper>
      <SmoothScrollProvider>{children}</SmoothScrollProvider>
    </HeroUIWrapper>
  )
}
