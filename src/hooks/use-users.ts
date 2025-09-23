import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export interface User {
  id: string
  full_name: string
  email: string
  contact_number?: string
  role: string
  created_at: string
  date_of_birth?: string
  gender?: string
  address?: string
  profile_picture_url?: string
}

interface UsersResponse {
  users: User[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface UsersParams {
  page: number
  limit: number
  search?: string
  role?: string
}

const fetchUsers = async (params: UsersParams): Promise<UsersResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.search && { search: params.search }),
    ...(params.role && { role: params.role })
  })

  const response = await fetch(`/api/users?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch users')
  return response.json()
}

const updateUserRole = async ({ id, role }: { id: string; role: string }): Promise<void> => {
  const response = await fetch(`/api/users?id=${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ role })
  })
  if (!response.ok) throw new Error('Failed to update user role')
}

export const useUsers = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [showRoleDialog, setShowRoleDialog] = useState(false)
  const [selectedRole, setSelectedRole] = useState('')
  const limit = 10

  const queryClient = useQueryClient()

  const usersQuery = useQuery({
    queryKey: ['users', { page: currentPage, search: searchTerm, role: roleFilter, limit }],
    queryFn: () => fetchUsers({ page: currentPage, limit, search: searchTerm, role: roleFilter }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const updateRoleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] })
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setShowRoleDialog(false)
      setSelectedUser(null)
    },
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value)
    setCurrentPage(1)
  }

  const handleRoleChange = (user: User) => {
    setSelectedUser(user)
    setSelectedRole(user.role)
    setShowRoleDialog(true)
  }

  const handleUpdateRole = () => {
    if (!selectedUser || !selectedRole) return
    updateRoleMutation.mutate({ id: selectedUser.id, role: selectedRole })
  }

  const handleRefresh = async () => {
    await usersQuery.refetch()
  }

  return {
    usersData: usersQuery.data || {
      users: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: usersQuery.isLoading,
    error: usersQuery.error?.message || updateRoleMutation.error?.message || '',
    searchTerm,
    roleFilter,
    selectedUser,
    showRoleDialog,
    selectedRole,
    currentPage,
    limit,
    updating: updateRoleMutation.isPending,
    refreshing: usersQuery.isFetching,
    setSearchTerm,
    setRoleFilter,
    setSelectedUser,
    setShowRoleDialog,
    setSelectedRole,
    setCurrentPage,
    handleSearch,
    handleRoleFilter,
    handleRoleChange,
    handleUpdateRole,
    handleRefresh,
    refetch: usersQuery.refetch
  }
}