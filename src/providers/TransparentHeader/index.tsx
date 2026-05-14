'use client'

import React, { createContext, use, useCallback, useState } from 'react'

interface TransparentHeaderContextType {
  transparent: boolean
  setTransparent: (value: boolean) => void
}

const TransparentHeaderContext = createContext<TransparentHeaderContextType>({
  transparent: false,
  setTransparent: () => null,
})

export const TransparentHeaderProvider = ({ children }: { children: React.ReactNode }) => {
  const [transparent, setTransparentState] = useState(false)
  const setTransparent = useCallback((value: boolean) => setTransparentState(value), [])

  return (
    <TransparentHeaderContext value={{ transparent, setTransparent }}>
      {children}
    </TransparentHeaderContext>
  )
}

export const useTransparentHeader = (): TransparentHeaderContextType =>
  use(TransparentHeaderContext)
