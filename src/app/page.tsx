'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'
import { useUserStore } from '@/store/useAuthStore'

export default function HomePage() {
  const { user, loading, isAdmin } = useUserStore()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (user && isAdmin) {
        router.replace('/dashboard')
      } else {
        router.replace('/authentication/login')
      }
    }
  }, [user, loading, isAdmin, router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-gray-600">Loading...</p>
      </div>
    </div>
  )
}
