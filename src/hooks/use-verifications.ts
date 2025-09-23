import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface Verification {
  id: string
  user_id: string
  status: string
  primary_id_type?: string
  primary_id_front?: string
  primary_id_back?: string
  secondary_id_type?: string
  secondary_id_image?: string
  selfie_image?: string
  reviewer_notes?: string
  created_at: string
  updated_at: string
  user?: {
    id: string
    full_name: string
    email: string
    role: string
    profile_picture_url?: string
  }
}

interface VerificationsResponse {
  verifications: Verification[]
  totalCount: number
  currentPage: number
  totalPages: number
}

interface VerificationsParams {
  page: number
  limit: number
  status?: string
}

const fetchVerifications = async (params: VerificationsParams): Promise<VerificationsResponse> => {
  const searchParams = new URLSearchParams({
    page: params.page.toString(),
    limit: params.limit.toString(),
    ...(params.status && params.status !== 'all' && { status: params.status })
  })

  const response = await fetch(`/api/verifications?${searchParams}`)
  if (!response.ok) throw new Error('Failed to fetch verifications')
  return response.json()
}

const updateVerificationStatus = async ({ id, status, notes }: { id: string, status: string, notes?: string }): Promise<void> => {
  const response = await fetch('/api/verifications', {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id,
      status,
      reviewer_notes: notes || ''
    }),
  })
  if (!response.ok) throw new Error('Failed to update verification')
}

const fetchVerificationImages = async (verificationId: string): Promise<Array<{type: string, label: string, url: string}>> => {
  const response = await fetch(`/api/verifications/${verificationId}/images`)
  if (!response.ok) throw new Error('Failed to fetch verification images')
  const data = await response.json()
  // API returns { images: [...] } but we need just the array
  return data.images || []
}

export const useVerifications = () => {
  const [currentPage, setCurrentPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('all')
  const [selectedVerification, setSelectedVerification] = useState<Verification | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [showImageDialog, setShowImageDialog] = useState(false)
  const [showActionsSheet, setShowActionsSheet] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string>('')
  const [verificationImages, setVerificationImages] = useState<Array<{type: string, label: string, url: string}>>([])
  const [loadingImages, setLoadingImages] = useState(false)
  const [reviewerNotes, setReviewerNotes] = useState('')
  const limit = 10

  const queryClient = useQueryClient()

  const verificationsQuery = useQuery({
    queryKey: ['verifications', { page: currentPage, status: statusFilter, limit }],
    queryFn: () => fetchVerifications({ page: currentPage, limit, status: statusFilter }),
    staleTime: 30 * 1000, // 30 seconds
    refetchOnWindowFocus: false,
    refetchInterval: false,
  })

  const updateMutation = useMutation({
    mutationFn: updateVerificationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['verifications'] })
      setShowActionsSheet(false)
    },
  })

  const handleStatusChange = (verificationId: string, newStatus: string) => {
    setStatusFilter(newStatus)
    setCurrentPage(1)
  }

  const handleUpdateVerificationStatus = async (id: string, status: string, notes?: string) => {
    updateMutation.mutate({ id, status, notes })
  }

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    setShowImageDialog(true)
  }

  const loadVerificationImages = async (verificationId: string) => {
    setLoadingImages(true)
    try {
      const images = await fetchVerificationImages(verificationId)
      setVerificationImages(images)
    } catch (error) {
      console.error('Error loading verification images:', error)
      setVerificationImages([])
    } finally {
      setLoadingImages(false)
    }
  }

  const handleRefresh = async () => {
    await verificationsQuery.refetch()
  }

  return {
    verificationsData: verificationsQuery.data || {
      verifications: [],
      totalCount: 0,
      currentPage: 1,
      totalPages: 0
    },
    loading: verificationsQuery.isLoading,
    error: verificationsQuery.error?.message || updateMutation.error?.message || '',
    statusFilter,
    selectedVerification,
    showDetailsDialog,
    showImageDialog,
    showActionsSheet,
    selectedImage,
    verificationImages,
    loadingImages,
    currentPage,
    limit,
    updating: updateMutation.isPending,
    refreshing: verificationsQuery.isFetching,
    reviewerNotes,
    setStatusFilter,
    setSelectedVerification,
    setShowDetailsDialog,
    setShowImageDialog,
    setShowActionsSheet,
    setSelectedImage,
    setVerificationImages,
    setLoadingImages,
    setCurrentPage,
    setReviewerNotes,
    handleStatusChange,
    handleUpdateVerificationStatus,
    handleImageClick,
    loadVerificationImages,
    handleRefresh,
    refetch: verificationsQuery.refetch
  }
}
