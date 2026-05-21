'use client'

import { useEffect } from 'react'

const LandingClient: React.FC = () => {
  useEffect(() => {
    document.body.classList.add('landing-no-scrollbar')
    return () => {
      document.body.classList.remove('landing-no-scrollbar')
    }
  }, [])
  return null
}

export default LandingClient
