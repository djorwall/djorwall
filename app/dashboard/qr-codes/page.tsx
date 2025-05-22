"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { QrCode, Search, Plus } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { QRCodeCreator } from "@/components/dashboard/qr-code-creator"
import { QRCodeCard } from "@/components/dashboard/qr-code-card"
import { getQRCodesAction, deleteQRCodeAction } from "@/app/actions"

interface QRCodeData {
  id: string
  name: string
  description: string | null
  dataUrl: string
  createdAt: string
  updatedAt: string
}

export default function QRCodesPage() {
  const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
  const [filteredQrCodes, setFilteredQrCodes] = useState<QRCodeData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedQrCodeId, setSelectedQrCodeId] = useState<string | null>(null)
  const { toast } = useToast()

  const fetchQRCodes = async () => {
    try {
      setIsLoading(true)
      const result = await getQRCodesAction()

      if (result.success) {
        setQrCodes(result.qrCodes)
        setFilteredQrCodes(result.qrCodes)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch QR codes",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQRCodes()
  }, [])

  useEffect(() => {
    if (searchQuery) {
      const filtered = qrCodes.filter(
        (qrCode) =>
          qrCode.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (qrCode.description && qrCode.description.toLowerCase().includes(searchQuery.toLowerCase())),
      )
      setFilteredQrCodes(filtered)
    } else {
      setFilteredQrCodes(qrCodes)
    }
  }, [searchQuery, qrCodes])

  const handleCreateSuccess = () => {
    setIsCreateDialogOpen(false)
    fetchQRCodes()
    toast({
      title: "Success",
      description: "QR code created successfully",
    })
  }

  const handleEditQRCode = (id: string) => {
    setSelectedQrCodeId(id)
    setIsEditDialogOpen(true)
  }

  const handleEditSuccess = () => {
    setIsEditDialogOpen(false)
    setSelectedQrCodeId(null)
    fetchQRCodes()
    toast({
      title: "Success",
      description: "QR code updated successfully",
    })
  }

  const handleDeleteQRCode = async (id: string) => {
    if (confirm("Are you sure you want to delete this QR code?")) {
      try {
        const result = await deleteQRCodeAction(id)

        if (result.success) {
          fetchQRCodes()
          toast({
            title: "Success",
            description: "QR code deleted successfully",
          })
        } else {
          toast({
            title: "Error",
            description: result.error || "Failed to delete QR code",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting QR code:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">QR Codes</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Create new QR code
        </Button>
      </div>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All QR codes</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search QR codes..."
                className="w-[250px] pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : filteredQrCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQrCodes.map((qrCode) => (
                    <QRCodeCard
                      key={qrCode.id}
                      id={qrCode.id}
                      name={qrCode.name}
                      description={qrCode.description}
                      dataUrl={qrCode.dataUrl}
                      createdAt={qrCode.createdAt}
                      onEdit={handleEditQRCode}
                      onDelete={handleDeleteQRCode}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <QrCode className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-4">You haven't created any QR codes yet</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>Create your first QR code</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardContent className="p-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : filteredQrCodes.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredQrCodes
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 6)
                    .map((qrCode) => (
                      <QRCodeCard
                        key={qrCode.id}
                        id={qrCode.id}
                        name={qrCode.name}
                        description={qrCode.description}
                        dataUrl={qrCode.dataUrl}
                        createdAt={qrCode.createdAt}
                        onEdit={handleEditQRCode}
                        onDelete={handleDeleteQRCode}
                      />
                    ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent QR codes found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create QR Code Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Create a new QR code</DialogTitle>
            <DialogDescription>
              Generate a QR code for your shortened link with custom styling options.
            </DialogDescription>
          </DialogHeader>
          <QRCodeCreator onSuccess={handleCreateSuccess} />
        </DialogContent>
      </Dialog>

      {/* Edit QR Code Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit QR code</DialogTitle>
            <DialogDescription>Update your QR code settings and styling options.</DialogDescription>
          </DialogHeader>
          {/* We'll implement the edit form in a future update */}
          <div className="py-4 text-center">
            <p>Edit functionality will be available in a future update.</p>
            <Button className="mt-4" onClick={() => setIsEditDialogOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
