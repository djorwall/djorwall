"use client"

import { useState } from "react"
import { Copy, ExternalLink, Link2, MoreHorizontal, Plus, Search, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Sample data - would be fetched from the database in a real application
const initialLinks = [
  {
    id: "1",
    originalUrl: "https://example.com/very/long/path/to/some/page?with=parameters&and=more",
    shortUrl: "app.io/r/abc123",
    slug: "abc123",
    createdBy: "john.doe@example.com",
    createdAt: "2023-05-15T14:30:00Z",
    expiresAt: "2024-05-15T14:30:00Z",
    clicks: 1245,
    status: "active",
    tags: ["marketing", "social"],
  },
  {
    id: "2",
    originalUrl: "https://anotherexample.com/products/featured",
    shortUrl: "app.io/r/def456",
    slug: "def456",
    createdBy: "jane.smith@example.com",
    createdAt: "2023-05-14T09:15:00Z",
    expiresAt: null,
    clicks: 873,
    status: "active",
    tags: ["product"],
  },
  {
    id: "3",
    originalUrl: "https://testsite.com/blog/article-123",
    shortUrl: "app.io/r/ghi789",
    slug: "ghi789",
    createdBy: "mark.wilson@example.com",
    createdAt: "2023-05-13T16:45:00Z",
    expiresAt: "2023-11-13T16:45:00Z",
    clicks: 421,
    status: "expired",
    tags: ["blog", "content"],
  },
  {
    id: "4",
    originalUrl: "https://example.org/events/upcoming",
    shortUrl: "app.io/r/jkl012",
    slug: "jkl012",
    createdBy: "sarah.johnson@example.com",
    createdAt: "2023-05-12T11:20:00Z",
    expiresAt: null,
    clicks: 1892,
    status: "active",
    tags: ["event"],
  },
  {
    id: "5",
    originalUrl: "https://demo.net/resources/downloads",
    shortUrl: "app.io/r/mno345",
    slug: "mno345",
    createdBy: "robert.brown@example.com",
    createdAt: "2023-05-11T13:10:00Z",
    expiresAt: null,
    clicks: 567,
    status: "inactive",
    tags: ["resource", "download"],
  },
]

export function LinkManagement() {
  const [links, setLinks] = useState(initialLinks)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [isEditLinkOpen, setIsEditLinkOpen] = useState(false)
  const [currentLink, setCurrentLink] = useState<(typeof initialLinks)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // New link form state
  const [newLink, setNewLink] = useState({
    originalUrl: "",
    slug: "",
    expiresAt: "",
    status: "active",
    tags: "",
  })

  const filteredLinks = links.filter((link) => {
    // Filter by search query
    const matchesSearch =
      link.originalUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.shortUrl.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.createdBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      link.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && link.status === "active"
    if (activeTab === "inactive") return matchesSearch && link.status === "inactive"
    if (activeTab === "expired") return matchesSearch && link.status === "expired"

    return matchesSearch
  })

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Never"
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const truncateUrl = (url: string, maxLength = 30) => {
    return url.length > maxLength ? `${url.substring(0, maxLength)}...` : url
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        // Could show a toast notification here
        console.log("Copied to clipboard")
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  const handleAddLink = () => {
    const id = (links.length + 1).toString()
    const createdAt = new Date().toISOString()
    const shortUrl = `app.io/r/${newLink.slug || generateRandomSlug()}`
    const expiresAt = newLink.expiresAt ? new Date(newLink.expiresAt).toISOString() : null
    const tags = newLink.tags
      .split(",")
      .map((tag) => tag.trim())
      .filter((tag) => tag)

    setLinks([
      ...links,
      {
        ...newLink,
        id,
        createdAt,
        shortUrl,
        slug: newLink.slug || generateRandomSlug(),
        expiresAt,
        clicks: 0,
        createdBy: "admin@appopener.io", // In a real app, this would be the current user
        tags,
      },
    ])

    setNewLink({
      originalUrl: "",
      slug: "",
      expiresAt: "",
      status: "active",
      tags: "",
    })
    setIsAddLinkOpen(false)
  }

  const handleEditLink = () => {
    if (!currentLink) return

    setLinks(
      links.map((link) =>
        link.id === currentLink.id
          ? {
              ...currentLink,
              tags:
                typeof currentLink.tags === "string"
                  ? currentLink.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter((tag) => tag)
                  : currentLink.tags,
            }
          : link,
      ),
    )
    setIsEditLinkOpen(false)
    setCurrentLink(null)
  }

  const handleDeleteLink = (id: string) => {
    setLinks(links.filter((link) => link.id !== id))
  }

  const openEditDialog = (link: (typeof initialLinks)[0]) => {
    setCurrentLink({
      ...link,
      tags: Array.isArray(link.tags) ? link.tags.join(", ") : link.tags,
    })
    setIsEditLinkOpen(true)
  }

  const generateRandomSlug = () => {
    return Math.random().toString(36).substring(2, 8)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Links</CardTitle>
            <CardDescription>Manage shortened links and their destinations</CardDescription>
          </div>
          <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Link</DialogTitle>
                <DialogDescription>Create a new shortened link with custom settings.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="originalUrl" className="text-right">
                    Original URL
                  </Label>
                  <Input
                    id="originalUrl"
                    value={newLink.originalUrl}
                    onChange={(e) => setNewLink({ ...newLink, originalUrl: e.target.value })}
                    className="col-span-3"
                    placeholder="https://example.com/long-url"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="slug" className="text-right">
                    Custom Slug
                  </Label>
                  <Input
                    id="slug"
                    value={newLink.slug}
                    onChange={(e) => setNewLink({ ...newLink, slug: e.target.value })}
                    className="col-span-3"
                    placeholder="Optional - leave blank for random"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="expiresAt" className="text-right">
                    Expires At
                  </Label>
                  <Input
                    id="expiresAt"
                    type="date"
                    value={newLink.expiresAt}
                    onChange={(e) => setNewLink({ ...newLink, expiresAt: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={newLink.status} onValueChange={(value) => setNewLink({ ...newLink, status: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="tags" className="text-right">
                    Tags
                  </Label>
                  <Input
                    id="tags"
                    value={newLink.tags}
                    onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })}
                    className="col-span-3"
                    placeholder="Comma-separated tags (e.g. marketing, social)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddLinkOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddLink}>Create Link</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Links</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="inactive">Inactive</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search links..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Short URL</TableHead>
                <TableHead>Original URL</TableHead>
                <TableHead>Created By</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLinks.map((link) => (
                <TableRow key={link.id}>
                  <TableCell className="font-medium">{link.shortUrl}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={link.originalUrl}>
                    {truncateUrl(link.originalUrl)}
                  </TableCell>
                  <TableCell>{link.createdBy}</TableCell>
                  <TableCell>{formatDate(link.expiresAt)}</TableCell>
                  <TableCell>{link.clicks.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        link.status === "active" ? "default" : link.status === "inactive" ? "secondary" : "destructive"
                      }
                    >
                      {link.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {Array.isArray(link.tags) &&
                        link.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => copyToClipboard(link.shortUrl)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy short URL
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => copyToClipboard(link.originalUrl)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy original URL
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Visit link
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => openEditDialog(link)}>
                          <Link2 className="mr-2 h-4 w-4" />
                          Edit link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteLink(link.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete link
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {filteredLinks.length} of {links.length} links
        </div>
      </CardFooter>

      {/* Edit Link Dialog */}
      <Dialog open={isEditLinkOpen} onOpenChange={setIsEditLinkOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Link</DialogTitle>
            <DialogDescription>Update link details and settings.</DialogDescription>
          </DialogHeader>
          {currentLink && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-originalUrl" className="text-right">
                  Original URL
                </Label>
                <Input
                  id="edit-originalUrl"
                  value={currentLink.originalUrl}
                  onChange={(e) => setCurrentLink({ ...currentLink, originalUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-slug" className="text-right">
                  Slug
                </Label>
                <Input
                  id="edit-slug"
                  value={currentLink.slug}
                  onChange={(e) =>
                    setCurrentLink({
                      ...currentLink,
                      slug: e.target.value,
                      shortUrl: `app.io/r/${e.target.value}`,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-expiresAt" className="text-right">
                  Expires At
                </Label>
                <Input
                  id="edit-expiresAt"
                  type="date"
                  value={currentLink.expiresAt ? new Date(currentLink.expiresAt).toISOString().split("T")[0] : ""}
                  onChange={(e) =>
                    setCurrentLink({
                      ...currentLink,
                      expiresAt: e.target.value ? new Date(e.target.value).toISOString() : null,
                    })
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentLink.status}
                  onValueChange={(value) => setCurrentLink({ ...currentLink, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-tags" className="text-right">
                  Tags
                </Label>
                <Input
                  id="edit-tags"
                  value={currentLink.tags}
                  onChange={(e) => setCurrentLink({ ...currentLink, tags: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditLinkOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditLink}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
