import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Doctor {
  id: string
  full_name: string
  email: string
  contact_number?: string
  role: string
  created_at: string
  availability_days?: string[]
  availability_times?: string[]
  address?: string
  date_of_birth?: string
  gender?: string
  profile_picture_url?: string
}

interface DoctorsResponse {
  doctors: Doctor[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface DoctorsParams {
  page: number
  limit: number
  search?: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
}

const fetchDoctors = async (params: DoctorsParams): Promise<DoctorsResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    ...(params.search && { search: params.search })
  })

  const response = await fetch(`/api/doctors?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch doctors')
  return response.json()
}

const deleteDoctor = async (id: string): Promise<void> => {
  const response = await fetch(`/api/doctors?id=${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete doctor')
}

export const useDoctors = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const limit = 10

  const queryClient = useQueryClient()

  const doctorsQuery = useQuery({
    queryKey: ['doctors', { page: currentPage, search: searchTerm, sortBy, sortOrder, limit }],
    queryFn: () => fetchDoctors({ page: currentPage, limit, search: searchTerm, sortBy, sortOrder }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const deleteMutation = useMutation({
    mutationFn: deleteDoctor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['doctors'] })
      setShowDetailsDialog(false)
    },
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDeleteDoctor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this doctor? This action cannot be undone.')) {
      return
    }
    deleteMutation.mutate(id)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleRefresh = async () => {
    await doctorsQuery.refetch()
  }

  const clearFilters = () => {
    setSearchTerm('')
    setSortBy('created_at')
    setSortOrder('desc')
    setCurrentPage(1)
  }

  return {
    doctorsData: doctorsQuery.data || {
      doctors: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: doctorsQuery.isLoading,
    error: doctorsQuery.error?.message || deleteMutation.error?.message || '',
    searchTerm,
    sortBy,
    sortOrder,
    selectedDoctor,
    showDetailsDialog,
    showFilters,
    currentPage,
    limit,
    deleting: deleteMutation.isPending ? selectedDoctor?.id || null : null,
    refreshing: doctorsQuery.isFetching,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setSelectedDoctor,
    setShowDetailsDialog,
    setShowFilters,
    setCurrentPage,
    handleSearch,
    handleDeleteDoctor,
    handlePageChange,
    handleRefresh,
    clearFilters,
    refetch: doctorsQuery.refetch
  }
}
