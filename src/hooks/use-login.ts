import { useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'

interface LoginCredentials {
  email: string
  password: string
}

export const useLogin = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()
  const router = useRouter()

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: LoginCredentials) => {
      return await signIn(email, password)
    },
    onSuccess: () => {
      router.push('/dashboard')
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
