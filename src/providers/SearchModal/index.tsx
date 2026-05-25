'use client'

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'

type SearchModalContextType = {
  isOpen: boolean
  openModal: () => void
  closeModal: () => void
}

const SearchModalContext = createContext<SearchModalContextType>({
  isOpen: false,
  openModal: () => {},
  closeModal: () => {},
})

export const useSearchModal = () => useContext(SearchModalContext)

export const SearchModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const openModal = useCallback(() => setIsOpen(true), [])
  const closeModal = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault()
        setIsOpen((prev) => !prev)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <SearchModalContext.Provider value={{ isOpen, openModal, closeModal }}>
      {children}
    </SearchModalContext.Provider>
  )
}
