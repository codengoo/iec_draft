'use client'

import React from 'react'
import { HeroUIProvider, ToastProvider } from '@heroui/react'

export const HeroUIWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <HeroUIProvider>
      <ToastProvider placement="top-right" toastOffset={16} maxVisibleToasts={4} />
      {children}
    </HeroUIProvider>
  )
}
