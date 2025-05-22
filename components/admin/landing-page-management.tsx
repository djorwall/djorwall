"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Eye, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Mock data for landing pages
const mockLandingPages = [
  {
    id: "1",
    name: "Summer Promotion",
    slug: "summer-promo",
    status: "published",
    template: "promotion",
    createdAt: "2023-06-15",
    views: 1245,
    conversions: 87,
  },
  {
    id: "2",
    name: "Product Launch",
    slug: "new-product-2023",
    status: "draft",
    template: "product",
    createdAt: "2023-07-22",
    views: 0,
    conversions: 0,
  },
  {
    id: "3",
    name: "Holiday Special",
    slug: "holiday-2023",
    status: "published",
    template: "promotion",
    createdAt: "2023-08-05",
    views: 856,
    conversions: 42,
  },
  {
    id: "4",
    name: "Newsletter Signup",
    slug: "newsletter",
    status: "published",
    template: "lead-capture",
    createdAt: "2023-05-10",
    views: 3421,
    conversions: 215,
  },
  {
    id: "5",
    name: "Webinar Registration",
    slug: "webinar-sept",
    status: "scheduled",
    template: "event",
    createdAt: "2023-08-20",
    views: 124,
    conversions: 36,
  },
]

export default function LandingPageManagement() {
  const [landingPages, setLandingPages] = useState(mockLandingPages)
  const [searchQuery, setSearchQuery] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState<any>(null)
  const [newPage, setNewPage] = useState({
    name: "",
    slug: "",
    template: "blank",
    status: "draft",
  })

  const filteredPages = landingPages.filter(
    (page) =>
      page.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      page.slug.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleCreatePage = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const newLandingPage = {
      id,
      name: newPage.name,
      slug: newPage.slug || newPage.name.toLowerCase().replace(/\s+/g, "-"),
      status: newPage.status,
      template: newPage.template,
      createdAt: new Date().toISOString().split("T")[0],
      views: 0,
      conversions: 0,
    }

    setLandingPages([...landingPages, newLandingPage])
    setNewPage({
      name: "",
      slug: "",
      template: "blank",
      status: "draft",
    })
    setIsCreateDialogOpen(false)
  }

  const handleUpdatePage = () => {
    if (!currentPage) return

    const updatedPages = landingPages.map((page) => (page.id === currentPage.id ? currentPage : page))

    setLandingPages(updatedPages)
    setIsEditDialogOpen(false)
  }

  const handleDeletePage = () => {
    if (!currentPage) return

    const updatedPages = landingPages.filter((page) => page.id !== currentPage.id)
    setLandingPages(updatedPages)
    setIsDeleteDialogOpen(false)
  }

  const handleDuplicatePage = (page: any) => {
    const id = Math.random().toString(36).substring(2, 9)
    const duplicatedPage = {
      ...page,
      id,
      name: `${page.name} (Copy)`,
      slug: `${page.slug}-copy`,
      status: "draft",
      views: 0,
      conversions: 0,
      createdAt: new Date().toISOString().split("T")[0],
    }

    setLandingPages([...landingPages, duplicatedPage])
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "published":
        return <Badge className="bg-green-500">Published</Badge>
      case "draft":
        return <Badge variant="outline">Draft</Badge>
      case "scheduled":
        return <Badge className="bg-blue-500">Scheduled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Search landing pages..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-[300px]"
          />
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Create Landing Page
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Create New Landing Page</DialogTitle>
              <DialogDescription>Fill in the details to create a new landing page.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newPage.name}
                  onChange={(e) => setNewPage({ ...newPage, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="slug"
                  value={newPage.slug}
                  onChange={(e) => setNewPage({ ...newPage, slug: e.target.value })}
                  className="col-span-3"
                  placeholder="auto-generated-if-empty"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="template" className="text-right">
                  Template
                </Label>
                <Select value={newPage.template} onValueChange={(value) => setNewPage({ ...newPage, template: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="lead-capture">Lead Capture</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select value={newPage.status} onValueChange={(value) => setNewPage({ ...newPage, status: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePage}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Slug</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Template</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Views</TableHead>
                <TableHead className="text-right">Conversions</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPages.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No landing pages found
                  </TableCell>
                </TableRow>
              ) : (
                filteredPages.map((page) => (
                  <TableRow key={page.id}>
                    <TableCell className="font-medium">{page.name}</TableCell>
                    <TableCell>{page.slug}</TableCell>
                    <TableCell>{getStatusBadge(page.status)}</TableCell>
                    <TableCell className="capitalize">{page.template}</TableCell>
                    <TableCell>{page.createdAt}</TableCell>
                    <TableCell className="text-right">{page.views.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{page.conversions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentPage(page)
                            setIsEditDialogOpen(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Edit</span>
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleDuplicatePage(page)}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Duplicate</span>
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Eye className="h-4 w-4" />
                          <span className="sr-only">Preview</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setCurrentPage(page)
                            setIsDeleteDialogOpen(true)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Landing Page</DialogTitle>
            <DialogDescription>Update the details of your landing page.</DialogDescription>
          </DialogHeader>
          {currentPage && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentPage.name}
                  onChange={(e) => setCurrentPage({ ...currentPage, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  value={currentPage.slug}
                  onChange={(e) => setCurrentPage({ ...currentPage, slug: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-template" className="text-right">
                  Template
                </Label>
                <Select
                  value={currentPage.template}
                  onValueChange={(value) => setCurrentPage({ ...currentPage, template: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a template" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="blank">Blank</SelectItem>
                    <SelectItem value="promotion">Promotion</SelectItem>
                    <SelectItem value="product">Product</SelectItem>
                    <SelectItem value="lead-capture">Lead Capture</SelectItem>
                    <SelectItem value="event">Event</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentPage.status}
                  onValueChange={(value) => setCurrentPage({ ...currentPage, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdatePage}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Landing Page</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this landing page? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePage}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
