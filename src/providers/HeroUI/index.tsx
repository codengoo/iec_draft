'use client'

import React from 'react'
import { HeroUIProvider } from '@heroui/react'

export const HeroUIWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <HeroUIProvider>{children}</HeroUIProvider>
}
