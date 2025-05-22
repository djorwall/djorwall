"use client"

import { useState } from "react"
import { MoreHorizontal, Plus, Search, Trash } from "lucide-react"

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
import { Switch } from "@/components/ui/switch"

// Sample data - would be fetched from the database in a real application
const initialRedirects = [
  {
    id: "1",
    name: "Marketing Campaign Redirect",
    pattern: "/campaign/:id",
    target: "https://example.com/marketing/campaign?id=$1&source=app",
    type: "301",
    active: true,
    createdAt: "2023-05-15T14:30:00Z",
    conditions: "User-Agent contains 'Mobile'",
  },
  {
    id: "2",
    name: "Legacy URL Support",
    pattern: "/old-blog/:slug",
    target: "/blog/$1",
    type: "302",
    active: true,
    createdAt: "2023-04-20T09:15:00Z",
    conditions: "",
  },
  {
    id: "3",
    name: "Country-Specific Redirect",
    pattern: "/products",
    target: "/products/eu",
    type: "302",
    active: true,
    createdAt: "2023-03-10T16:45:00Z",
    conditions: "Country equals 'DE,FR,IT'",
  },
  {
    id: "4",
    name: "Maintenance Redirect",
    pattern: "/api/*",
    target: "/maintenance",
    type: "307",
    active: false,
    createdAt: "2023-02-05T11:20:00Z",
    conditions: "",
  },
  {
    id: "5",
    name: "Seasonal Promotion",
    pattern: "/promo",
    target: "/summer-sale",
    type: "302",
    active: true,
    createdAt: "2023-01-15T13:10:00Z",
    conditions: "Date between '2023-06-01' and '2023-08-31'",
  },
]

export function RedirectManagement() {
  const [redirects, setRedirects] = useState(initialRedirects)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddRedirectOpen, setIsAddRedirectOpen] = useState(false)
  const [isEditRedirectOpen, setIsEditRedirectOpen] = useState(false)
  const [currentRedirect, setCurrentRedirect] = useState<(typeof initialRedirects)[0] | null>(null)

  // New redirect form state
  const [newRedirect, setNewRedirect] = useState({
    name: "",
    pattern: "",
    target: "",
    type: "302",
    active: true,
    conditions: "",
  })

  const filteredRedirects = redirects.filter(
    (redirect) =>
      redirect.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redirect.pattern.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redirect.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
      redirect.conditions.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleAddRedirect = () => {
    const id = (redirects.length + 1).toString()
    const createdAt = new Date().toISOString()

    setRedirects([...redirects, { ...newRedirect, id, createdAt }])
    setNewRedirect({
      name: "",
      pattern: "",
      target: "",
      type: "302",
      active: true,
      conditions: "",
    })
    setIsAddRedirectOpen(false)
  }

  const handleEditRedirect = () => {
    if (!currentRedirect) return

    setRedirects(redirects.map((redirect) => (redirect.id === currentRedirect.id ? currentRedirect : redirect)))
    setIsEditRedirectOpen(false)
    setCurrentRedirect(null)
  }

  const handleDeleteRedirect = (id: string) => {
    setRedirects(redirects.filter((redirect) => redirect.id !== id))
  }

  const openEditDialog = (redirect: (typeof initialRedirects)[0]) => {
    setCurrentRedirect(redirect)
    setIsEditRedirectOpen(true)
  }

  const toggleRedirectStatus = (id: string) => {
    setRedirects(
      redirects.map((redirect) => (redirect.id === id ? { ...redirect, active: !redirect.active } : redirect)),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Redirects</CardTitle>
            <CardDescription>Manage URL redirects and redirection rules</CardDescription>
          </div>
          <Dialog open={isAddRedirectOpen} onOpenChange={setIsAddRedirectOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Redirect
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Redirect</DialogTitle>
                <DialogDescription>Create a new URL redirect with custom rules and conditions.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newRedirect.name}
                    onChange={(e) => setNewRedirect({ ...newRedirect, name: e.target.value })}
                    className="col-span-3"
                    placeholder="Descriptive name for this redirect"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="pattern" className="text-right">
                    URL Pattern
                  </Label>
                  <Input
                    id="pattern"
                    value={newRedirect.pattern}
                    onChange={(e) => setNewRedirect({ ...newRedirect, pattern: e.target.value })}
                    className="col-span-3"
                    placeholder="/path/:param or /path/*"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="target" className="text-right">
                    Target URL
                  </Label>
                  <Input
                    id="target"
                    value={newRedirect.target}
                    onChange={(e) => setNewRedirect({ ...newRedirect, target: e.target.value })}
                    className="col-span-3"
                    placeholder="https://example.com or /new-path/$1"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="type" className="text-right">
                    Redirect Type
                  </Label>
                  <Select
                    value={newRedirect.type}
                    onValueChange={(value) => setNewRedirect({ ...newRedirect, type: value })}
                  >
                    <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="Select redirect type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="301">301 - Permanent</SelectItem>
                      <SelectItem value="302">302 - Temporary</SelectItem>
                      <SelectItem value="307">307 - Temporary (Strict)</SelectItem>
                      <SelectItem value="308">308 - Permanent (Strict)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="active" className="text-right">
                    Active
                  </Label>
                  <div className="col-span-3 flex items-center space-x-2">
                    <Switch
                      id="active"
                      checked={newRedirect.active}
                      onCheckedChange={(checked) => setNewRedirect({ ...newRedirect, active: checked })}
                    />
                    <Label htmlFor="active" className="text-sm text-muted-foreground">
                      {newRedirect.active ? "Redirect is active" : "Redirect is inactive"}
                    </Label>
                  </div>
                </div>
                <div className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor="conditions" className="text-right pt-2">
                    Conditions
                  </Label>
                  <Textarea
                    id="conditions"
                    value={newRedirect.conditions}
                    onChange={(e) => setNewRedirect({ ...newRedirect, conditions: e.target.value })}
                    className="col-span-3 min-h-[100px]"
                    placeholder="Optional conditions (e.g., User-Agent contains 'Mobile', Country equals 'US,CA')"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddRedirectOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddRedirect}>Create Redirect</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search redirects..."
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
                <TableHead>URL Pattern</TableHead>
                <TableHead>Target</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRedirects.map((redirect) => (
                <TableRow key={redirect.id}>
                  <TableCell className="font-medium">{redirect.name}</TableCell>
                  <TableCell>{redirect.pattern}</TableCell>
                  <TableCell className="max-w-[200px] truncate" title={redirect.target}>
                    {redirect.target}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{redirect.type}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={redirect.active ? "default" : "secondary"}>
                      {redirect.active ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(redirect.createdAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => openEditDialog(redirect)}>Edit redirect</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => toggleRedirectStatus(redirect.id)}>
                          {redirect.active ? "Deactivate" : "Activate"}
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteRedirect(redirect.id)}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete redirect
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
          Showing {filteredRedirects.length} of {redirects.length} redirects
        </div>
      </CardFooter>

      {/* Edit Redirect Dialog */}
      <Dialog open={isEditRedirectOpen} onOpenChange={setIsEditRedirectOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Redirect</DialogTitle>
            <DialogDescription>Update redirect settings and conditions.</DialogDescription>
          </DialogHeader>
          {currentRedirect && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-name" className="text-right">
                  Name
                </Label>
                <Input
                  id="edit-name"
                  value={currentRedirect.name}
                  onChange={(e) => setCurrentRedirect({ ...currentRedirect, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-pattern" className="text-right">
                  URL Pattern
                </Label>
                <Input
                  id="edit-pattern"
                  value={currentRedirect.pattern}
                  onChange={(e) => setCurrentRedirect({ ...currentRedirect, pattern: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-target" className="text-right">
                  Target URL
                </Label>
                <Input
                  id="edit-target"
                  value={currentRedirect.target}
                  onChange={(e) => setCurrentRedirect({ ...currentRedirect, target: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-type" className="text-right">
                  Redirect Type
                </Label>
                <Select
                  value={currentRedirect.type}
                  onValueChange={(value) => setCurrentRedirect({ ...currentRedirect, type: value })}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select redirect type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="301">301 - Permanent</SelectItem>
                    <SelectItem value="302">302 - Temporary</SelectItem>
                    <SelectItem value="307">307 - Temporary (Strict)</SelectItem>
                    <SelectItem value="308">308 - Permanent (Strict)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="edit-active" className="text-right">
                  Active
                </Label>
                <div className="col-span-3 flex items-center space-x-2">
                  <Switch
                    id="edit-active"
                    checked={currentRedirect.active}
                    onCheckedChange={(checked) => setCurrentRedirect({ ...currentRedirect, active: checked })}
                  />
                  <Label htmlFor="edit-active" className="text-sm text-muted-foreground">
                    {currentRedirect.active ? "Redirect is active" : "Redirect is inactive"}
                  </Label>
                </div>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="edit-conditions" className="text-right pt-2">
                  Conditions
                </Label>
                <Textarea
                  id="edit-conditions"
                  value={currentRedirect.conditions}
                  onChange={(e) => setCurrentRedirect({ ...currentRedirect, conditions: e.target.value })}
                  className="col-span-3 min-h-[100px]"
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditRedirectOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditRedirect}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
