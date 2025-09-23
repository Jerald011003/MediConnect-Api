import { useQuery } from '@tanstack/react-query'

interface DashboardStats {
  totalPatients: number
  totalDoctors: number
  pendingVerifications: number
  totalAppointments: number
}

interface RecentUser {
  id: string
  full_name: string
  email: string
  role: string
  created_at: string
  profile_picture_url?: string
}

interface RecentVerification {
  id: string
  status: string
  created_at: string
  user: {
    full_name: string
    email: string
    profile_picture_url?: string
  }
}

const fetchDashboardStats = async (): Promise<DashboardStats> => {
  const response = await fetch('/api/dashboard/stats')
  if (!response.ok) throw new Error('Failed to fetch stats')
  return response.json()
}

const fetchRecentUsers = async (): Promise<RecentUser[]> => {
  const response = await fetch('/api/dashboard/recent-users')
  if (!response.ok) throw new Error('Failed to fetch recent users')
  return response.json()
}

const fetchRecentVerifications = async (): Promise<RecentVerification[]> => {
  const response = await fetch('/api/dashboard/recent-verifications')
  if (!response.ok) throw new Error('Failed to fetch recent verifications')
  return response.json()
}

export const useDashboardStats = () => {
  return useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: fetchDashboardStats,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  })
}

export const useRecentUsers = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-users'],
    queryFn: fetchRecentUsers,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  })
}

export const useRecentVerifications = () => {
  return useQuery({
    queryKey: ['dashboard', 'recent-verifications'],
    queryFn: fetchRecentVerifications,
    staleTime: 60 * 1000, // 1 minute
    refetchOnWindowFocus: false,
  })
}

export const useDashboard = () => {
  const statsQuery = useDashboardStats()
  const recentUsersQuery = useRecentUsers()
  const recentVerificationsQuery = useRecentVerifications()

  return {
    stats: statsQuery.data || {
      totalPatients: 0,
      totalDoctors: 0,
      pendingVerifications: 0,
      totalAppointments: 0
    },
    recentUsers: recentUsersQuery.data || [],
    recentVerifications: recentVerificationsQuery.data || [],
    isLoading: statsQuery.isLoading || recentUsersQuery.isLoading || recentVerificationsQuery.isLoading,
    error: statsQuery.error?.message || recentUsersQuery.error?.message || recentVerificationsQuery.error?.message || null,
    refetchAll: () => {
      statsQuery.refetch()
      recentUsersQuery.refetch()
      recentVerificationsQuery.refetch()
    }
  }
}
