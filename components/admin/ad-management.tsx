"use client"

import { useState } from "react"
import { Calendar, Eye, MoreHorizontal, Plus, Search, Trash } from "lucide-react"

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
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

// Sample data - would be fetched from the database in a real application
const initialAds = [
  {
    id: "1",
    name: "Summer Sale Banner",
    type: "banner",
    placement: "homepage",
    content: "<div class='ad-banner'>Summer Sale - 50% Off!</div>",
    imageUrl: "/placeholder.svg?key=nwm9f",
    startDate: "2023-06-01T00:00:00Z",
    endDate: "2023-08-31T23:59:59Z",
    status: "active",
    impressions: 12450,
    clicks: 1245,
    ctr: 10.0,
    targeting: "location=US,CA;device=desktop,mobile",
  },
  {
    id: "2",
    name: "New Product Sidebar",
    type: "sidebar",
    placement: "product-page",
    content: "<div class='ad-sidebar'>Check out our new products!</div>",
    imageUrl: "/placeholder.svg?key=pkkua",
    startDate: "2023-05-15T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "active",
    impressions: 8730,
    clicks: 654,
    ctr: 7.5,
    targeting: "interest=technology;device=desktop",
  },
  {
    id: "3",
    name: "Holiday Promotion",
    type: "popup",
    placement: "checkout",
    content: "<div class='ad-popup'>Special holiday discount!</div>",
    imageUrl: "/placeholder-7ndl7.png",
    startDate: "2023-11-15T00:00:00Z",
    endDate: "2023-12-25T23:59:59Z",
    status: "scheduled",
    impressions: 0,
    clicks: 0,
    ctr: 0,
    targeting: "returning=true",
  },
  {
    id: "4",
    name: "Newsletter Signup",
    type: "inline",
    placement: "blog-post",
    content: "<div class='ad-inline'>Sign up for our newsletter!</div>",
    imageUrl: "/placeholder.svg?height=150&width=500&query=newsletter+signup+ad",
    startDate: "2023-01-01T00:00:00Z",
    endDate: "2023-12-31T23:59:59Z",
    status: "active",
    impressions: 15620,
    clicks: 2343,
    ctr: 15.0,
    targeting: "",
  },
  {
    id: "5",
    name: "Flash Sale Alert",
    type: "notification",
    placement: "global",
    content: "<div class='ad-notification'>Flash sale today only!</div>",
    imageUrl: "/placeholder.svg?height=100&width=300&query=flash+sale+notification",
    startDate: "2023-05-20T00:00:00Z",
    endDate: "2023-05-20T23:59:59Z",
    status: "ended",
    impressions: 5430,
    clicks: 1086,
    ctr: 20.0,
    targeting: "device=mobile",
  },
]

export function AdManagement() {
  const [ads, setAds] = useState(initialAds)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddAdOpen, setIsAddAdOpen] = useState(false)
  const [isEditAdOpen, setIsEditAdOpen] = useState(false)
  const [isPreviewAdOpen, setIsPreviewAdOpen] = useState(false)
  const [currentAd, setCurrentAd] = useState<(typeof initialAds)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("all")

  // New ad form state
  const [newAd, setNewAd] = useState({
    name: "",
    type: "banner",
    placement: "homepage",
    content: "",
    imageUrl: "",
    startDate: "",
    endDate: "",
    status: "draft",
    targeting: "",
  })

  const filteredAds = ads.filter((ad) => {
    // Filter by search query
    const matchesSearch =
      ad.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ad.placement.toLowerCase().includes(searchQuery.toLowerCase())

    // Filter by tab
    if (activeTab === "all") return matchesSearch
    if (activeTab === "active") return matchesSearch && ad.status === "active"
    if (activeTab === "scheduled") return matchesSearch && ad.status === "scheduled"
    if (activeTab === "ended") return matchesSearch && ad.status === "ended"
    if (activeTab === "draft") return matchesSearch && ad.status === "draft"

    return matchesSearch
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleAddAd = () => {
    const id = (ads.length + 1).toString()
    const impressions = 0
    const clicks = 0
    const ctr = 0

    setAds([
      ...ads,
      {
        ...newAd,
        id,
        impressions,
        clicks,
        ctr,
        startDate: new Date(newAd.startDate).toISOString(),
        endDate: new Date(newAd.endDate).toISOString(),
      },
    ])

    setNewAd({
      name: "",
      type: "banner",
      placement: "homepage",
      content: "",
      imageUrl: "",
      startDate: "",
      endDate: "",
      status: "draft",
      targeting: "",
    })
    setIsAddAdOpen(false)
  }

  const handleEditAd = () => {
    if (!currentAd) return

    setAds(
      ads.map((ad) =>
        ad.id === currentAd.id
          ? {
              ...currentAd,
              startDate: new Date(currentAd.startDate).toISOString(),
              endDate: new Date(currentAd.endDate).toISOString(),
            }
          : ad,
      ),
    )
    setIsEditAdOpen(false)
    setCurrentAd(null)
  }

  const handleDeleteAd = (id: string) => {
    setAds(ads.filter((ad) => ad.id !== id))
  }

  const openEditDialog = (ad: (typeof initialAds)[0]) => {
    setCurrentAd({
      ...ad,
      startDate: new Date(ad.startDate).toISOString().split("T")[0],
      endDate: new Date(ad.endDate).toISOString().split("T")[0],
    })
    setIsEditAdOpen(true)
  }

  const openPreviewDialog = (ad: (typeof initialAds)[0]) => {
    setCurrentAd(ad)
    setIsPreviewAdOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Advertisements</CardTitle>
            <CardDescription>Manage ads, campaigns, and placements</CardDescription>
          </div>
          <Dialog open={isAddAdOpen} onOpenChange={setIsAddAdOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Ad
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Advertisement</DialogTitle>
                <DialogDescription>Create a new ad with custom content and targeting options.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Ad Name
                  </Label>
                  <Input
                    id="name"
                    value={newAd.name}
                    onChange={(e) => setNewAd({ ...newAd, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Descriptive name for this ad"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Ad Type
                  </Label>
                  <Select value={newAd.type} onValueChange={(value) => setNewAd({ ...newAd, type: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select ad type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="banner">Banner</SelectItem>
                      <SelectItem value="sidebar">Sidebar</SelectItem>
                      <SelectItem value="popup">Popup</SelectItem>
                      <SelectItem value="inline">Inline</SelectItem>
                      <SelectItem value="notification">Notification</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="placement" className="text-right">
                    Placement
                  </Label>
                  <Select value={newAd.placement} onValueChange={(value) => setNewAd({ ...newAd, placement: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select placement" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="homepage">Homepage</SelectItem>
                      <SelectItem value="product-page">Product Page</SelectItem>
                      <SelectItem value="checkout">Checkout</SelectItem>
                      <SelectItem value="blog-post">Blog Post</SelectItem>
                      <SelectItem value="global">Global</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="content" className="text-right pt-2">
                    Content
                  </Label>
                  <Textarea
                    id="content"
                    value={newAd.content}
                    onChange={(e) => setNewAd({ ...newAd, content: e.target.value })}
                    className="col-span-3 min-h-[100px]"
                    placeholder="HTML content or text for the ad"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="imageUrl" className="text-right">
                    Image URL
                  </Label>
                  <Input
                    id="imageUrl"
                    value={newAd.imageUrl}
                    onChange={(e) => setNewAd({ ...newAd, imageUrl: e.target.value })}
                    className="col-span-3"
                    placeholder="URL to the ad image"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="startDate" className="text-right">
                    Start Date
                  </Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={newAd.startDate}
                    onChange={(e) => setNewAd({ ...newAd, startDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="endDate" className="text-right">
                    End Date
                  </Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={newAd.endDate}
                    onChange={(e) => setNewAd({ ...newAd, endDate: e.target.value })}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="status" className="text-right">
                    Status
                  </Label>
                  <Select value={newAd.status} onValueChange={(value) => setNewAd({ ...newAd, status: value })}>
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="targeting" className="text-right pt-2">
                    Targeting
                  </Label>
                  <Textarea
                    id="targeting"
                    value={newAd.targeting}
                    onChange={(e) => setNewAd({ ...newAd, targeting: e.target.value })}
                    className="col-span-3"
                    placeholder="Targeting options (e.g., location=US,CA;device=desktop,mobile)"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddAdOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddAd}>Create Ad</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="mb-4">
          <TabsList>
            <TabsTrigger value="all">All Ads</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
            <TabsTrigger value="ended">Ended</TabsTrigger>
            <TabsTrigger value="draft">Draft</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search ads..."
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
                <TableHead>Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Placement</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Impressions</TableHead>
                <TableHead>Clicks</TableHead>
                <TableHead>CTR</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAds.map((ad) => (
                <TableRow key={ad.id}>
                  <TableCell className="font-medium">{ad.name}</TableCell>
                  <TableCell>{ad.type}</TableCell>
                  <TableCell>{ad.placement}</TableCell>
                  <TableCell>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 border-dashed">
                          <Calendar className="mr-2 h-4 w-4" />
                          {formatDate(ad.startDate)} - {formatDate(ad.endDate)}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-80">
                        <div className="grid gap-4">
                          <div className="space-y-2">
                            <h4 className="font-medium leading-none">Duration</h4>
                            <p className="text-sm text-muted-foreground">Start: {formatDate(ad.startDate)}</p>
                            <p className="text-sm text-muted-foreground">End: {formatDate(ad.endDate)}</p>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        ad.status === "active"
                          ? "default"
                          : ad.status === "scheduled"
                            ? "outline"
                            : ad.status === "draft"
                              ? "secondary"
                              : "destructive"
                      }
                    >
                      {ad.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                  <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                  <TableCell>{ad.ctr.toFixed(2)}%</TableCell>
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
                        <DropdownMenuItem onClick={() => openPreviewDialog(ad)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(ad)}>Edit ad</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive" onClick={() => handleDeleteAd(ad.id)}>
                          <Trash className="mr-2 h-4 w-4" />
                          Delete ad
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
          Showing {filteredAds.length} of {ads.length} ads
        </div>
      </CardFooter>

      {/* Edit Ad Dialog */}
      <Dialog open={isEditAdOpen} onOpenChange={setIsEditAdOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
            <DialogDescription>Update ad content, targeting, and schedule.</DialogDescription>
          </DialogHeader>
          {currentAd && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Ad Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentAd.name}
                  onChange={(e) => setCurrentAd({ ...currentAd, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Ad Type
                </Label>
                <Select value={currentAd.type} onValueChange={(value) => setCurrentAd({ ...currentAd, type: value })}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select ad type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="banner">Banner</SelectItem>
                    <SelectItem value="sidebar">Sidebar</SelectItem>
                    <SelectItem value="popup">Popup</SelectItem>
                    <SelectItem value="inline">Inline</SelectItem>
                    <SelectItem value="notification">Notification</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-placement" className="text-right">
                  Placement
                </Label>
                <Select
                  value={currentAd.placement}
                  onValueChange={(value) => setCurrentAd({ ...currentAd, placement: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select placement" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="homepage">Homepage</SelectItem>
                    <SelectItem value="product-page">Product Page</SelectItem>
                    <SelectItem value="checkout">Checkout</SelectItem>
                    <SelectItem value="blog-post">Blog Post</SelectItem>
                    <SelectItem value="global">Global</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-content" className="text-right pt-2">
                  Content
                </Label>
                <Textarea
                  id="edit-content"
                  value={currentAd.content}
                  onChange={(e) => setCurrentAd({ ...currentAd, content: e.target.value })}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-imageUrl" className="text-right">
                  Image URL
                </Label>
                <Input
                  id="edit-imageUrl"
                  value={currentAd.imageUrl}
                  onChange={(e) => setCurrentAd({ ...currentAd, imageUrl: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-startDate" className="text-right">
                  Start Date
                </Label>
                <Input
                  id="edit-startDate"
                  type="date"
                  value={currentAd.startDate}
                  onChange={(e) => setCurrentAd({ ...currentAd, startDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-endDate" className="text-right">
                  End Date
                </Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  value={currentAd.endDate}
                  onChange={(e) => setCurrentAd({ ...currentAd, endDate: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-status" className="text-right">
                  Status
                </Label>
                <Select
                  value={currentAd.status}
                  onValueChange={(value) => setCurrentAd({ ...currentAd, status: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="scheduled">Scheduled</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="ended">Ended</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-targeting" className="text-right pt-2">
                  Targeting
                </Label>
                <Textarea
                  id="edit-targeting"
                  value={currentAd.targeting}
                  onChange={(e) => setCurrentAd({ ...currentAd, targeting: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditAdOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditAd}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Ad Dialog */}
      <Dialog open={isPreviewAdOpen} onOpenChange={setIsPreviewAdOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Ad Preview: {currentAd?.name}</DialogTitle>
            <DialogDescription>Preview how the ad will appear to users.</DialogDescription>
          </DialogHeader>
          {currentAd && (
            <div className="py-4">
              <div className="mb-4 p-4 border rounded-md">
                <div className="mb-2 font-semibold">Ad Content:</div>
                <div className="p-2 bg-muted rounded-md">
                  <pre className="text-sm whitespace-pre-wrap">{currentAd.content}</pre>
                </div>
              </div>

              {currentAd.imageUrl && (
                <div className="mb-4">
                  <div className="mb-2 font-semibold">Ad Image:</div>
                  <div className="border rounded-md overflow-hidden">
                    <img
                      src={currentAd.imageUrl || "/placeholder.svg"}
                      alt={currentAd.name}
                      className="max-w-full h-auto"
                    />
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="font-semibold mb-1">Type:</div>
                  <div>{currentAd.type}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Placement:</div>
                  <div>{currentAd.placement}</div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Duration:</div>
                  <div>
                    {formatDate(currentAd.startDate)} - {formatDate(currentAd.endDate)}
                  </div>
                </div>
                <div>
                  <div className="font-semibold mb-1">Status:</div>
                  <Badge
                    variant={
                      currentAd.status === "active"
                        ? "default"
                        : currentAd.status === "scheduled"
                          ? "outline"
                          : currentAd.status === "draft"
                            ? "secondary"
                            : "destructive"
                    }
                  >
                    {currentAd.status}
                  </Badge>
                </div>
              </div>

              {currentAd.targeting && (
                <div className="mt-4">
                  <div className="font-semibold mb-1">Targeting:</div>
                  <div className="p-2 bg-muted rounded-md">
                    <pre className="text-sm whitespace-pre-wrap">{currentAd.targeting}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setIsPreviewAdOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
