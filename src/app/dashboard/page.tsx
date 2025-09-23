'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useDashboard } from '@/hooks/use-dashboard'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Users, 
  UserCog, 
  Bell, 
  Calendar, 
  ArrowUpRight,
  TrendingUp,
  Clock,
  Shield,
  CheckCircle,
  XCircle,
  Loader2
} from 'lucide-react'

export default function DashboardPage() {
  const { user, profile } = useAuth()
  const { stats, recentUsers, recentVerifications, isLoading, error } = useDashboard() as {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    stats: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentUsers: any[],
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    recentVerifications: any[],
    isLoading: boolean,
    error: { message?: string } | string | null,
  }

  const statCards = [
    {
      title: 'Total Patients',
      value: stats.totalPatients,
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      trend: '+12% from last month'
    },
    {
      title: 'Total Doctors',
      value: stats.totalDoctors,
      icon: UserCog,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      trend: '+3% from last month'
    },
    {
      title: 'Pending Verifications',
      value: stats.pendingVerifications,
      icon: Bell,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      trend: stats.pendingVerifications > 0 ? 'Requires attention' : 'All caught up'
    },
    {
      title: 'Total Appointments',
      value: stats.totalAppointments,
      icon: Calendar,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      trend: '+8% from last month'
    }
  ]

  const getVerificationStatusBadge = (status: string) => {
    switch (status) {
      case 'verified':
        return <Badge variant="default" className="bg-green-100 text-green-800">Verified</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'verified':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Shield className="h-4 w-4 text-gray-600" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6 mx-auto">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Welcome back, {profile?.full_name || user?.email}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          {/* <Badge variant="outline" className="px-3 py-1">
            <Activity className="w-4 h-4 mr-1" />
            System Online
          </Badge> */}
          {/* <Button
            variant="outline"
            onClick={signOut}
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button> */}
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>
            {typeof error === 'string'
              ? error
              : error?.message || 'An error occurred'}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, index) => {
          const Icon = card.icon
          return (
            <Card key={index} className="hover:shadow-lg transition-all duration-200 border-0 shadow-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-full ${card.bgColor}`}>
                  <Icon className={`w-4 h-4 ${card.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-900 mb-1">
                  {card.value.toLocaleString()}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {card.trend}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {stats.pendingVerifications > 0 && (
        <Alert className="border-orange-200 bg-orange-50">
          <Bell className="h-4 w-4 text-orange-600" />
          <AlertDescription className="flex items-center justify-between w-full">
            <div>
              <strong className="text-orange-800">
                {stats.pendingVerifications} verification{stats.pendingVerifications !== 1 ? 's' : ''} pending review
              </strong>
              <p className="text-orange-700 text-sm mt-1">
                Doctor verification requests awaiting your attention
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => window.location.href = '/dashboard/verifications'}>
              Review Now
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="users" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Recent Users
          </TabsTrigger>
          <TabsTrigger value="verifications" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Recent Verifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Recently Joined Users
              </CardTitle>
              <CardDescription>
                Latest user registrations across the platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent user registrations</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                      <div className="flex items-center space-x-3">
                        <Avatar>
                          <AvatarImage src={user.profile_picture_url} />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {getUserInitials(user.full_name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge 
                          variant={user.role === 'doctor' ? 'default' : 'secondary'}
                          className={user.role === 'doctor' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
                        >
                          {user.role === 'doctor' ? 'Doctor' : 'Patient'}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(user.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Recent Verification Requests
              </CardTitle>
              <CardDescription>
                Latest doctor verification submissions and status updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentVerifications.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No recent verification requests</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {recentVerifications.map((verification) => (
                    <div key={verification.id} className="flex items-center justify-between p-3 rounded-lg border bg-gray-50/50">
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-100">
                          {getStatusIcon(verification.status)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{verification.user.full_name}</p>
                          <p className="text-sm text-gray-500">{verification.user.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        {getVerificationStatusBadge(verification.status)}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(verification.created_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}