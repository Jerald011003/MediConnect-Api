'use client'

import { useUsers } from '@/hooks/use-users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Search,
  RefreshCw,
  Users,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Mail,
  Calendar,
  Phone,
  Crown
} from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function UsersPage() {
  const {
    usersData,
    loading,
    error,
    searchTerm,
    roleFilter,
    selectedUser,
    showRoleDialog,
    selectedRole,
    currentPage,
    updating,
    refreshing,
    setSelectedRole,
    setShowRoleDialog,
    setCurrentPage,
    handleSearch,
    handleRoleFilter,
    handleRoleChange,
    handleUpdateRole,
    handleRefresh
  } = useUsers()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="destructive" className="text-xs"><Crown className="w-3 h-3 mr-1" />Admin</Badge>
      case 'doctor':
        return <Badge variant="default" className="text-xs bg-green-100 text-green-700 hover:bg-green-200"><UserCheck className="w-3 h-3 mr-1" />Doctor</Badge>
      case 'patient':
        return <Badge variant="secondary" className="text-xs"><Users className="w-3 h-3 mr-1" />Patient</Badge>
      default:
        return <Badge variant="outline" className="text-xs">Unknown</Badge>
    }
  }
  return (
    <div className="p-6 space-y-6 mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage user roles and permissions ({usersData.totalCount} total users)
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
                <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Refresh user list</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>

      {/* Filters */}
      {/* <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
          <CardDescription>Search and filter users</CardDescription>
        </CardHeader> */}
        {/* <CardContent className=""> */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* <div className="flex-1"> */}
              {/* <Label htmlFor="search" className="text-sm font-medium">Search Users</Label> */}
              <div className="relative mt-1 w-[20%]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="search"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            {/* </div> */}
            
            {/* <div className="w-full sm:w-48"> */}
              {/* <Label htmlFor="role-filter" className="text-sm font-medium">Filter by Role</Label> */}
              <Select value={roleFilter} onValueChange={handleRoleFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="All Roles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="patient">Patient</SelectItem>
                </SelectContent>
              </Select>
            {/* </div> */}
          </div>
        {/* </CardContent> */}
      {/* </Card> */}

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({usersData.totalCount})</CardTitle>
          <CardDescription>Manage user accounts and roles</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="w-6 h-6 animate-spin mr-2" />
              <span>Loading users...</span>
            </div>
          ) : usersData.users.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-500">No users found</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersData.users.map((user) => (
                  <TableRow key={user.id} className="hover:bg-gray-50">
                    <TableCell className="py-4">
                      <div className="flex items-center space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage
                            src={user.profile_picture_url}
                            alt={user.full_name}
                          />
                          <AvatarFallback className="bg-blue-100 text-blue-600">
                            {user.full_name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">{user.email}</span>
                        </div>
                        {user.contact_number && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4 text-gray-400" />
                            <span className="text-sm">{user.contact_number}</span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          {formatDate(user.created_at)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRoleChange(user)}
                        disabled={updating}
                      >
                        Change Role
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}

          {usersData.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6 pt-4 border-t">
              <p className="text-sm text-gray-700">
                Page {usersData.currentPage} of {usersData.totalPages}
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === usersData.totalPages || loading}
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role Change Dialog */}
      <Dialog open={showRoleDialog} onOpenChange={setShowRoleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change User Role</DialogTitle>
            <DialogDescription>
              Update the role for {selectedUser?.full_name}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="role-select">Select New Role</Label>
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="mt-1">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="patient">Patient</SelectItem>
                  <SelectItem value="doctor">Doctor</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Alert>
              <Crown className="h-4 w-4" />
              <AlertDescription>
                Changing a user&apos;s role will immediately affect their access permissions.
                {selectedRole === 'doctor' && ' Promoting to doctor will require verification.'}
              </AlertDescription>
            </Alert>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRoleDialog(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleUpdateRole} 
              disabled={updating || !selectedRole || selectedRole === selectedUser?.role}
            >
              {updating ? 'Updating...' : 'Update Role'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}