import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@/store/useAuthStore'

interface LoginCredentials {
  email: string
  password: string
}

export const useLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useUserStore()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      return await signIn(email, password)
    },
    onSuccess: () => {
      router.push('/')
    },
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    loginMutation.mutate({ email, password })
  }

  return {
    email,
    password,
    loading: loginMutation.isPending,
    error: loginMutation.error?.message || '',
    setEmail,
    setPassword,
    handleSubmit
  }
}
