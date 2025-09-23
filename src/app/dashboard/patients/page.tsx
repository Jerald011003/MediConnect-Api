'use client'

import { Patient, usePatients } from '@/hooks/use-patients'
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Alert, AlertDescription } from '@/components/ui/alert'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import {
  Search,
  RefreshCw,
  Eye,
  Users,
  Calendar,
  Mail,
  Phone,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  UserX
} from 'lucide-react'
import { Label } from '@/components/ui/label'

export default function PatientsPage() {
  const {
    patientsData,
    loading,
    error,
    searchTerm,
    currentPage,
    selectedPatient,
    showDetailsDialog,
    setSelectedPatient,
    setShowDetailsDialog,
    setCurrentPage,
    handleSearch,
    handleDeletePatient,
    handleRefresh,
    refreshing
  } = usePatients()

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getVerificationStatus = (patient: Patient) => {
    return <Badge variant="outline">Patient</Badge>
  }

  const handleViewDetails = (patient: Patient) => {
    setSelectedPatient(patient)
    setShowDetailsDialog(true)
  }

  const handleCloseDialog = () => {
    setShowDetailsDialog(false)
    setSelectedPatient(null)
  }

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Patient Management</h1>
            <p className="text-gray-600 mt-1">
              Manage patient accounts and information ({patientsData.totalCount} total)
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
          </div>
        </div>

        {/* Search Card */}
        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Search & Filters</CardTitle>
          </CardHeader>
          <CardContent> */}
        <div className="flex items-center space-x-4">
          <div className="w-[20%] relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search patients by name or email..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        {/* </CardContent>
        </Card> */}

        {/* Error Alert */}
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Patients Table */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Patients Directory
                </CardTitle>
                <CardDescription>
                  {loading ? 'Loading...' : `Showing ${patientsData.patients.length} of ${patientsData.totalCount} patients`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                  <p className="text-gray-600">Loading patients...</p>
                </div>
              </div>
            ) : patientsData.patients.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No patients found</h3>
                <p className="text-gray-600">
                  {searchTerm ? `No results for "${searchTerm}"` : 'No patients have been registered yet.'}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Patient</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Member Since</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="w-[70px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {patientsData.patients.map((patient) => (
                      <TableRow key={patient.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarImage src={patient.profile_picture_url} />
                              <AvatarFallback className="bg-blue-100 text-blue-600">
                                {patient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-gray-900">{patient.full_name}</p>
                              <p className="text-sm text-gray-500">{patient.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="w-3 h-3 mr-1" />
                              {patient.email}
                            </div>
                            {patient.contact_number && (
                              <div className="flex items-center text-sm text-gray-600">
                                <Phone className="w-3 h-3 mr-1" />
                                {patient.contact_number}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="w-3 h-3 mr-1" />
                            {formatDate(patient.created_at)}
                          </div>
                        </TableCell>
                        <TableCell>
                          {getVerificationStatus(patient)}
                        </TableCell>
                        <TableCell>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(patient)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View patient details</p>
                            </TooltipContent>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {/* Pagination */}
                {patientsData.totalPages > 1 && (
                  <div className="flex items-center justify-between pt-4">
                    <div className="text-sm text-gray-600">
                      Page {patientsData.currentPage} of {patientsData.totalPages}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                        Previous
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, patientsData.totalPages))}
                        disabled={currentPage === patientsData.totalPages}
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

        {/* Patient Details Dialog */}
        <Dialog open={showDetailsDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Details
              </DialogTitle>
              <DialogDescription>
                Complete information about {selectedPatient?.full_name}
              </DialogDescription>
            </DialogHeader>

            {selectedPatient && (
              <div className="space-y-6">
                {/* Patient Profile Section */}
                <div className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={selectedPatient.profile_picture_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-lg">
                      {selectedPatient.full_name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{selectedPatient.full_name}</h3>
                    <p className="text-gray-600">{selectedPatient.email}</p>
                    <Badge className="mt-2 bg-blue-100 text-blue-800">Patient</Badge>
                  </div>
                </div>

                {/* Patient Information Grid */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Email</Label>
                    <p className="text-gray-900">{selectedPatient.email}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Phone</Label>
                    <p className="text-gray-900">{selectedPatient.contact_number || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Gender</Label>
                    <p className="text-gray-900">{selectedPatient.gender || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Date of Birth</Label>
                    <p className="text-gray-900">{selectedPatient.date_of_birth ? formatDate(selectedPatient.date_of_birth) : 'Not provided'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-sm font-medium text-gray-500">Address</Label>
                    <p className="text-gray-900">{selectedPatient.address || 'Not provided'}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-500">Member Since</Label>
                    <p className="text-gray-900">{formatDate(selectedPatient.created_at)}</p>
                  </div>
                  <div className="flex-col flex gap-2">
                    <Label className="text-sm font-medium text-gray-500">Account Status</Label>
                    <Badge variant="outline">Active Patient</Badge>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end space-x-3 pt-4 border-t">
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleDeletePatient(selectedPatient.id)
                      handleCloseDialog()
                    }}
                  >
                    <UserX className="w-4 h-4 mr-2" />
                    Delete Patient
                  </Button>
                  <Button variant="outline" onClick={handleCloseDialog}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </TooltipProvider>
  )
}