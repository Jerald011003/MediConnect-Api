'use client'

import { useVerifications } from '@/hooks/use-verifications'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import {

  Calendar,
  Eye,
  Check,
  X,
  Clock,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Shield,
  FileText,
  ZoomIn,
  Image as ImageIcon,
  Settings,
  MoreHorizontal,
  UserCheck,
  AlertTriangle,
  Loader2
} from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'

export default function VerificationsPage() {
  const {
    verificationsData,
    loading,
    error,
    statusFilter,
    selectedVerification,
    showDetailsDialog,
    showImageDialog,
    showActionsSheet,
    selectedImage,
    verificationImages,
    loadingImages,
    currentPage,
    updating,
    refreshing,
    reviewerNotes,
    setStatusFilter,
    setSelectedVerification,
    setShowDetailsDialog,
    setShowImageDialog,
    setShowActionsSheet,
    setCurrentPage,
    setReviewerNotes,
    handleUpdateVerificationStatus,
    handleImageClick,
    loadVerificationImages,
    handleRefresh
  } = useVerifications()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProfileImage = (user: any) => {
    if (user?.profile_picture_url) {
      return user.profile_picture_url
    }
    return null
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getProfileInitials = (user: any) => {
    if (!user?.full_name) return 'U'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return user.full_name.split(' ').map((n: any[]) => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getStatusBadge = (status: string) => {
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

  return (
    <TooltipProvider>
      <div className="p-6 space-y-6 mx-auto">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Verification Management</h1>
            <p className="text-gray-600 mt-1">
              Review and manage doctor verification requests ({verificationsData.totalCount} total)
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
                <p>Refresh verification list</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                {/* <Button variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button> */}
              </TooltipTrigger>
              <TooltipContent>
                <p>Export verification data</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        {/* <Button>
          <Download className="w-4 h-4 mr-2" />
          Export
        </Button> */}

        {/* <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters</CardTitle>
          </CardHeader>
          <CardContent> */}
        <div className="flex items-center space-x-4">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="verified">Verified</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* </CardContent>
        </Card> */}

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Verifications ({verificationsData.totalCount})</CardTitle>
                <CardDescription>
                  Showing {verificationsData.verifications.length} of {verificationsData.totalCount} verification requests
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin mr-2" />
                <span>Loading verifications...</span>
              </div>
            ) : verificationsData.verifications.length === 0 ? (
              <div className="text-center py-8">
                <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No verifications found</p>
                {statusFilter && (
                  <p className="text-sm text-gray-400 mt-2">
                    Try adjusting your filter criteria
                  </p>
                )}
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>ID Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verificationsData.verifications.map((verification) => (
                    <TableRow key={verification.id} className="hover:bg-gray-50">
                      <TableCell className="py-4">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage
                              src={getProfileImage(verification.user)}
                              alt={verification.user?.full_name}
                            />
                            <AvatarFallback className="bg-blue-100 text-blue-600">
                              {getProfileInitials(verification.user)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium text-gray-900">
                              {verification.user?.full_name || 'Unknown User'}
                            </p>
                            <p className="text-sm text-gray-500">
                              {verification.user?.email}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <FileText className="w-4 h-4 text-gray-400" />
                          <span className="text-sm">
                            {verification.primary_id_type || 'Not specified'}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(verification.status)}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger>
                            <Badge variant="outline" className="text-xs">
                              {verification.user?.role}
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>User Role: {verification.user?.role}</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-600">
                            {formatDate(verification.created_at)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">

                          {verification.status === 'pending' && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="default"
                                  className="border border-gray-200 bg-white text-green-600 hover:text-white hover:bg-green-700"
                                  onClick={() => {
                                    if (selectedVerification) {
                                      handleUpdateVerificationStatus(selectedVerification.id, "verified", reviewerNotes)
                                      setShowActionsSheet(false)
                                    }
                                  }}
                                  disabled={updating}
                                >
                                  {updating ? (
                                    <RefreshCw className="w-3 h-3 animate-spin" />
                                  ) : (
                                    // <Check className="w-3 h-3" />
                                    null
                                  )}
                                  Verify
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Verify this patient</p>
                              </TooltipContent>
                            </Tooltip>
                          )}


                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedVerification(verification)
                                  setShowDetailsDialog(true)
                                  loadVerificationImages(verification.id)
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>View verification details and documents</p>
                            </TooltipContent>
                          </Tooltip>






                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem
                                onClick={() => {
                                  setSelectedVerification(verification)
                                  setReviewerNotes(verification.reviewer_notes || '')
                                  setShowActionsSheet(true)
                                }}
                              >
                                <Settings className="w-4 h-4 mr-2" />
                                Quick Actions
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0">
                <DialogHeader className="p-6 pb-0">
                  <DialogTitle>Document Image</DialogTitle>
                </DialogHeader>
                <div className="p-6">
                  {selectedImage && (
                    <div className="relative w-full h-96">
                      <Image
                        src={selectedImage}
                        alt="Verification document"
                        fill
                        className="object-contain"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                      />
                    </div>
                  )}
                </div>
              </DialogContent>
            </Dialog>

            {verificationsData.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 pt-4 border-t">
                <p className="text-sm text-gray-700">
                  Page {verificationsData.currentPage} of {verificationsData.totalPages}
                </p>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, verificationsData.totalPages))}
                    disabled={currentPage === verificationsData.totalPages}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={getProfileImage(selectedVerification?.user)}
                    alt={selectedVerification?.user?.full_name}
                  />
                  <AvatarFallback className="bg-blue-100 text-blue-600">
                    {getProfileInitials(selectedVerification?.user)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <span>Details</span>
                  <DialogDescription>
                    {selectedVerification?.user?.full_name} - {selectedVerification?.user?.email}
                  </DialogDescription>
                </div>
              </DialogTitle>
            </DialogHeader>

            {selectedVerification && (
              <Tabs defaultValue="info" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="info">User Information</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="history">History</TabsTrigger>
                </TabsList>

                <TabsContent value="info" className="space-y-4">
                  <div className="grid grid-cols-2 gap-2">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Personal Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Full Name</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">{selectedVerification.user?.full_name}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Email</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">
                            {selectedVerification.user?.email}
                          </p>
                        </div>
                        <div className='flex-col flex'>
                          <Label className="text-sm font-semibold text-gray-700">Role</Label>
                          <Badge variant="outline" className="mt-1">
                            {selectedVerification.user?.role}
                          </Badge>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Details</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Status</Label>
                          <div className="mt-1">
                            {getStatusBadge(selectedVerification.status)}
                          </div>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Primary ID Type</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">{selectedVerification.primary_id_type || 'Not specified'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Secondary ID Type</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">{selectedVerification.secondary_id_type || 'Not provided'}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Submitted</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">{formatDate(selectedVerification.created_at)}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-semibold text-gray-700">Last Updated</Label>
                          <p className="mt-1 break-all text-sm text-gray-700">{formatDate(selectedVerification.updated_at)}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {selectedVerification.reviewer_notes && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">Previous Review Notes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm bg-gray-50 p-4 rounded-md">{selectedVerification.reviewer_notes}</p>
                      </CardContent>
                    </Card>
                  )}
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  {loadingImages ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-8 h-8 mx-auto animate-spin mb-4" />
                      <p>Loading verification documents...</p>
                    </div>
                  ) : verificationImages.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4">
                      {verificationImages.map((image, index) => (
                        <Card key={index} className="cursor-pointer hover:shadow-lg transition-shadow"
                          onClick={() => handleImageClick(image.url)}>
                          <CardHeader>
                            <CardTitle className="text-base">{image.label}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="relative w-full h-48">
                              <Image
                                src={image.url}
                                alt={image.label}
                                className="w-full h-full object-cover rounded-md"
                              />
                              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-20 transition-all rounded-md">
                                <ZoomIn className="w-6 h-6 text-white opacity-0 hover:opacity-100 transition-opacity" />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-500">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4" />
                      <p className="text-lg">No documents uploaded</p>
                      <p className="text-sm">User hasn&apos;t submitted verification documents yet</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Verification Timeline</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-5"></div>
                          <div>
                            <Label className="text-sm font-semibold text-gray-700">Verification Submitted</Label>
                            <p className="text-sm text-gray-500">{formatDate(selectedVerification.created_at)}</p>
                          </div>
                        </div>
                        {selectedVerification.updated_at !== selectedVerification.created_at && (
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-green-500 rounded-full mt-5"></div>
                            <div>
                              <Label className="text-sm font-semibold text-gray-700">Status Updated</Label>
                              <p className="text-sm text-gray-500">{formatDate(selectedVerification.updated_at)}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </DialogContent>
        </Dialog>

        <Sheet open={showActionsSheet} onOpenChange={setShowActionsSheet}>
          <SheetContent side="right" className="w-[400px] sm:w-[540px] p-6 flex flex-col">
            {/* Header */}
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5" />
                Quick Actions
              </SheetTitle>
              <SheetDescription>
                Update verification status for {selectedVerification?.user?.full_name}
              </SheetDescription>
            </SheetHeader>

            {selectedVerification && (
              <div className="flex-1 mt-6 space-y-6 overflow-y-auto pr-1">
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                  <Avatar className="h-10 w-10">
                    <AvatarImage
                      src={getProfileImage(selectedVerification.user)}
                      alt={selectedVerification.user?.full_name}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {getProfileInitials(selectedVerification.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedVerification.user?.full_name}</p>
                    <p className="text-sm text-gray-500 break-all">{selectedVerification.user?.email}</p>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Current Status</Label>
                  <div className="mt-2">{getStatusBadge(selectedVerification.status)}</div>
                </div>

                {/* <div>
                  <Label htmlFor="review-notes" className="text-sm font-medium">
                    Review Notes
                  </Label>
                  <Textarea
                    id="review-notes"
                    placeholder="Add notes about your review decision..."
                    value={reviewerNotes}
                    onChange={(e) => setReviewerNotes(e.target.value)}
                    className="mt-2"
                    rows={4}
                  />
                </div> */}

                {selectedVerification.reviewer_notes && (
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">Previous Notes</p>
                        <p className="text-sm text-yellow-700 mt-1">
                          {selectedVerification.reviewer_notes}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedVerification && (
              <div className="mt-6 space-y-3">
                {/* <Label className="text-sm font-medium">Update Status</Label> */}
                <div className="grid grid-cols-1 gap-3">

                  <Button
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 h-12"
                    onClick={() => {
                      handleUpdateVerificationStatus(selectedVerification.id, "verified", reviewerNotes)
                      setShowActionsSheet(false)
                    }}
                    disabled={updating}
                  >
                    {updating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4 mr-2" />
                    )}
                    Mark as Verified
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => {
                      handleUpdateVerificationStatus(selectedVerification.id, "pending", reviewerNotes)
                      setShowActionsSheet(false)
                    }}
                    disabled={updating}
                  >
                    {updating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Clock className="w-4 h-4 mr-2" />
                    )}
                    Set as Pending
                  </Button>

                  <Button
                    variant="destructive"
                    className="h-12"
                    onClick={() => {
                      handleUpdateVerificationStatus(selectedVerification.id, "rejected", reviewerNotes)
                      setShowActionsSheet(false)
                    }}
                    disabled={updating}
                  >
                    {updating ? (
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <X className="w-4 h-4 mr-2" />
                    )}
                    Reject Verification
                  </Button>
                </div>
              </div>
            )}
          </SheetContent>
        </Sheet>

        <Dialog open={showImageDialog} onOpenChange={setShowImageDialog}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle>Document Image</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              {selectedImage && (
                <div className="relative w-full h-96">
                  <Image
                    src={selectedImage}
                    alt="Verification document"
                    fill
                    className="object-contain"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
                  />
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>

    </TooltipProvider >
  )
}