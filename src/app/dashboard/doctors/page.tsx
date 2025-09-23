'use client'

import { useDoctors } from '@/hooks/use-doctors'
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Search,
  MoreHorizontal,
  RefreshCw,
  Eye,
  Trash2,
  UserCog,
  Calendar,
  Clock,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'

export default function DoctorsPage() {
  const {
    doctorsData,
    loading,
    error,
    searchTerm,
    selectedDoctor,
    showDetailsDialog,
    currentPage,
    deleting,
    refreshing,
    setSearchTerm,
    setSelectedDoctor,
    setShowDetailsDialog,
    handleDeleteDoctor,
    handlePageChange,
    handleRefresh,
  } = useDoctors()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatAvailability = (days?: string[], times?: string[]) => {
    if (!days || !times) return 'Not set'
    return `${days.join(', ')} • ${times.join(', ')}`
  }

  const getUserInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }


  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Doctor Management</h1>
            <p className="text-gray-600 mt-1">
              Manage doctor accounts and verifications ({doctorsData.totalCount} total)
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
                <p>Refresh doctor list</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              {/* <TooltipTrigger asChild>
                <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </TooltipTrigger> */}
              <TooltipContent>
                <p>Export doctors data</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>

        {/* <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Search & Filters</CardTitle>
              <Sheet open={showFilters} onOpenChange={setShowFilters}>
                <SheetTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filter Options</SheetTitle>
                    <SheetDescription>
                      Refine your search with these filters
                    </SheetDescription>
                  </SheetHeader>
                  <div className="space-y-4 mt-6">
                    <div>
                      <label className="text-sm font-medium mb-2 block">Sort By</label>
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="created_at">Join Date</SelectItem>
                          <SelectItem value="full_name">Name</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">Order</label>
                      <Select value={sortOrder} onValueChange={(value: 'asc' | 'desc') => setSortOrder(value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="desc">Newest First</SelectItem>
                          <SelectItem value="asc">Oldest First</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <Button onClick={clearFilters} variant="outline" className="w-full">
                      Clear All Filters
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card> */}

          <div className="flex items-center space-x-4">
              <div className="relative w-[20%]">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search doctors by name, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Doctors Directory</CardTitle>
                <CardDescription>
                  {loading ? 'Loading...' : `Showing ${doctorsData.doctors.length} of ${doctorsData.totalCount} doctors`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading doctors...</p>
                </div>
              </div>
            ) : doctorsData.doctors.length === 0 ? (
              <div className="text-center py-12">
                <UserCog className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No doctors found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No doctors have been registered yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Doctor</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Availability</TableHead>
                      <TableHead>Joined</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {doctorsData.doctors.map((doctor) => (
                      <TableRow key={doctor.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={doctor.profile_picture_url} />
                              <AvatarFallback className="bg-green-100 text-green-600">
                                {getUserInitials(doctor.full_name)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">Dr. {doctor.full_name}</p>
                              <p className="text-sm text-gray-500">{doctor.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {doctor.contact_number && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1" />
                                {doctor.contact_number}
                              </div>
                            )}
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1" />
                              {doctor.email}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatAvailability(doctor.availability_days, doctor.availability_times)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-gray-600">
                            {formatDate(doctor.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            Doctor
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem

                                onClick={() => {
                                  setSelectedDoctor(doctor)
                                  setShowDetailsDialog(true)
                                }}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => handleDeleteDoctor(doctor.id)}
                                className="text-red-600"
                                disabled={deleting === doctor.id}
                              >
                                {deleting === doctor.id ? (
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="mr-2 h-4 w-4" />
                                )}
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {doctorsData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-600">
                      Page {doctorsData.currentPage} of {doctorsData.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === doctorsData.totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserCog className="h-5 w-5" />
                Doctor Details
              </DialogTitle>
              <DialogDescription>
                Complete information about Dr. {selectedDoctor?.full_name}
              </DialogDescription>
            </DialogHeader>
            {selectedDoctor && (
              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="profile">Profile</TabsTrigger>
                  <TabsTrigger value="availability">Availability</TabsTrigger>
                </TabsList>
                <TabsContent value="profile" className="space-y-4">
                  <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src={selectedDoctor.profile_picture_url} />
                      <AvatarFallback className="bg-green-100 text-green-600 text-lg">
                        {getUserInitials(selectedDoctor.full_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">Dr. {selectedDoctor.full_name}</h3>
                      <p className="text-gray-600">{selectedDoctor.email}</p>
                      <Badge className="mt-2 bg-green-100 text-green-800">Doctor</Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900">{selectedDoctor.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Phone</label>
                      <p className="text-gray-900">{selectedDoctor.contact_number || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Gender</label>
                      <p className="text-gray-900">{selectedDoctor.gender || 'Not provided'}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500">Date of Birth</label>
                      <p className="text-gray-900">{selectedDoctor.date_of_birth ? formatDate(selectedDoctor.date_of_birth) : 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Address</label>
                      <p className="text-gray-900">{selectedDoctor.address || 'Not provided'}</p>
                    </div>
                    <div className="col-span-2">
                      <label className="text-sm font-medium text-gray-500">Joined</label>
                      <p className="text-gray-900">{formatDate(selectedDoctor.created_at)}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="availability" className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Available Days
                    </h4>
                    {selectedDoctor.availability_days && selectedDoctor.availability_days.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.availability_days.map((day) => (
                          <Badge key={day} variant="outline">{day}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No availability days set</p>
                    )}
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium mb-3 flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      Available Times
                    </h4>
                    {selectedDoctor.availability_times && selectedDoctor.availability_times.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {selectedDoctor.availability_times.map((time) => (
                          <Badge key={time} variant="outline">{time}</Badge>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No availability times set</p>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}