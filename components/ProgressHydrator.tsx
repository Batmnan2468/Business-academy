'use client'
import { useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { hydrateFromDatabase } from '@/lib/syncProgress'

export default function ProgressHydrator() {
  const { isSignedIn, isLoaded } = useUser()

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      void hydrateFromDatabase()
    }
  }, [isLoaded, isSignedIn])

  return null
}
