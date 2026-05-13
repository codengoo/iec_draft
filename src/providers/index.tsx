import React from 'react'

import { HeaderThemeProvider } from './HeaderTheme'
import { HeroUIWrapper } from './HeroUI'
import { ThemeProvider } from './Theme'
import { SmoothScrollProvider } from './SmoothScroll'

export const Providers: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <ThemeProvider>
      <HeaderThemeProvider>
        <HeroUIWrapper>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </HeroUIWrapper>
      </HeaderThemeProvider>
    </ThemeProvider>
  )
}
