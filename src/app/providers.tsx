'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

import { Toaster } from 'react-hot-toast'
import { useAuthStore } from '../stores/authStore'


const queryClient = new QueryClient()

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // ✅ Ensure auth initializes only once on mount
    useAuthStore.getState().initializeAuth()
  }, [])

  if (!mounted) return null

  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" />
      {children}
 
    </QueryClientProvider>
  )
}
