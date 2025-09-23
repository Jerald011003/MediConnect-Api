import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

export interface Patient {
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

interface PatientsResponse {
  patients: Patient[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface PatientsParams {
  page: number
  limit: number
  search?: string
}

const fetchPatients = async (params: PatientsParams): Promise<PatientsResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.search && { search: params.search })
  })

  const response = await fetch(`/api/patients?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch patients')
  return response.json()
}

const deletePatient = async (id: string): Promise<void> => {
  const response = await fetch(`/api/patients?id=${id}`, {
    method: 'DELETE'
  })
  if (!response.ok) throw new Error('Failed to delete patient')
}

export const usePatients = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [genderFilter, setGenderFilter] = useState('all')
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const limit = 10

  const queryClient = useQueryClient()

  const patientsQuery = useQuery({
    queryKey: ['patients', { page: currentPage, search: searchTerm, limit }],
    queryFn: () => fetchPatients({ page: currentPage, limit, search: searchTerm }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const deleteMutation = useMutation({
    mutationFn: deletePatient,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patients'] })
      setShowDetailsDialog(false)
    },
  })

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handleDeletePatient = async (id: string) => {
    if (!confirm('Are you sure you want to delete this patient? This action cannot be undone.')) {
      return
    }
    deleteMutation.mutate(id)
  }

  const handleRefresh = async () => {
    await patientsQuery.refetch()
  }

  return {
    patientsData: patientsQuery.data || {
      patients: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: patientsQuery.isLoading,
    error: patientsQuery.error?.message || deleteMutation.error?.message || '',
    searchTerm,
    sortBy,
    sortOrder,
    genderFilter,
    selectedPatient,
    showDetailsDialog,
    showFilters,
    currentPage,
    limit,
    deleting: deleteMutation.isPending ? selectedPatient?.id || null : null,
    refreshing: patientsQuery.isFetching,
    setSearchTerm,
    setSortBy,
    setSortOrder,
    setGenderFilter,
    setSelectedPatient,
    setShowDetailsDialog,
    setShowFilters,
    setCurrentPage,
    handleSearch,
    handleDeletePatient,
    handleRefresh,
    refetch: patientsQuery.refetch
  }
}
