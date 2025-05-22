"use client"

import { useState } from "react"
import { Copy, Eye, MoreHorizontal, Plus, Search, Trash } from "lucide-react"

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { RedirectPagePreview } from "./redirect-page-preview"

// Sample data - would be fetched from the database in a real application
const initialTemplates = [
  {
    id: "1",
    name: "Standard Redirect",
    description: "Basic redirect page with countdown and ad space",
    isDefault: true,
    countdownDuration: 5,
    showSkipButton: true,
    showProgressBar: true,
    adPlacement: "center",
    headerText: "Redirecting you to the app",
    footerText: "Powered by Appopener.io",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#3b82f6",
    customCSS: "",
    customJS: "",
    adCode: '<div class="ad-space">Advertisement Space</div>',
    logoEnabled: true,
    logoUrl: "/abstract-logo.png",
    backgroundImageEnabled: false,
    backgroundImageUrl: "",
    videoEnabled: false,
    videoUrl: "",
    analyticsEnabled: true,
    createdAt: "2023-05-15T14:30:00Z",
    updatedAt: "2023-06-10T09:15:00Z",
  },
  {
    id: "2",
    name: "Premium App Redirect",
    description: "Enhanced redirect page with video background and minimal ads",
    isDefault: false,
    countdownDuration: 3,
    showSkipButton: true,
    showProgressBar: true,
    adPlacement: "bottom",
    headerText: "Your app is opening soon",
    footerText: "Premium experience by Appopener.io",
    backgroundColor: "#f8fafc",
    textColor: "#1e293b",
    accentColor: "#6366f1",
    customCSS: ".premium-container { box-shadow: 0 10px 25px rgba(0,0,0,0.05); }",
    customJS: "",
    adCode: '<div class="premium-ad">Premium Partner</div>',
    logoEnabled: true,
    logoUrl: "/placeholder-zxdg7.png",
    backgroundImageEnabled: true,
    backgroundImageUrl: "/placeholder.svg?height=600&width=1200&query=abstract+gradient+background",
    videoEnabled: false,
    videoUrl: "",
    analyticsEnabled: true,
    createdAt: "2023-07-20T11:45:00Z",
    updatedAt: "2023-08-05T16:30:00Z",
  },
  {
    id: "3",
    name: "Gaming App Redirect",
    description: "Vibrant redirect page designed for gaming apps with video trailer",
    isDefault: false,
    countdownDuration: 8,
    showSkipButton: true,
    showProgressBar: true,
    adPlacement: "side",
    headerText: "Your game is loading...",
    footerText: "Game redirects by Appopener.io",
    backgroundColor: "#18181b",
    textColor: "#f4f4f5",
    accentColor: "#ec4899",
    customCSS: ".game-container { border-radius: 12px; overflow: hidden; }",
    customJS: "console.log('Gaming template loaded');",
    adCode: '<div class="game-ad">Featured Games</div>',
    logoEnabled: true,
    logoUrl: "/placeholder.svg?height=120&width=120&query=gaming+logo",
    backgroundImageEnabled: false,
    backgroundImageUrl: "",
    videoEnabled: true,
    videoUrl: "https://example.com/game-trailer.mp4",
    analyticsEnabled: true,
    createdAt: "2023-09-10T08:20:00Z",
    updatedAt: "2023-09-15T13:40:00Z",
  },
]

export function RedirectPageManagement() {
  const [templates, setTemplates] = useState(initialTemplates)
  const [searchQuery, setSearchQuery] = useState("")
  const [isAddTemplateOpen, setIsAddTemplateOpen] = useState(false)
  const [isEditTemplateOpen, setIsEditTemplateOpen] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)
  const [currentTemplate, setCurrentTemplate] = useState<(typeof initialTemplates)[0] | null>(null)
  const [activeTab, setActiveTab] = useState("appearance")

  // New template form state
  const [newTemplate, setNewTemplate] = useState({
    name: "",
    description: "",
    isDefault: false,
    countdownDuration: 5,
    showSkipButton: true,
    showProgressBar: true,
    adPlacement: "center",
    headerText: "Redirecting you to the app",
    footerText: "Powered by Appopener.io",
    backgroundColor: "#ffffff",
    textColor: "#000000",
    accentColor: "#3b82f6",
    customCSS: "",
    customJS: "",
    adCode: '<div class="ad-space">Advertisement Space</div>',
    logoEnabled: true,
    logoUrl: "/abstract-logo.png",
    backgroundImageEnabled: false,
    backgroundImageUrl: "",
    videoEnabled: false,
    videoUrl: "",
    analyticsEnabled: true,
  })

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date)
  }

  const handleAddTemplate = () => {
    const id = (templates.length + 1).toString()
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    // If this is set as default, update other templates
    let updatedTemplates = [...templates]
    if (newTemplate.isDefault) {
      updatedTemplates = updatedTemplates.map((template) => ({
        ...template,
        isDefault: false,
      }))
    }

    setTemplates([
      ...updatedTemplates,
      {
        ...newTemplate,
        id,
        createdAt,
        updatedAt,
      },
    ])

    setNewTemplate({
      name: "",
      description: "",
      isDefault: false,
      countdownDuration: 5,
      showSkipButton: true,
      showProgressBar: true,
      adPlacement: "center",
      headerText: "Redirecting you to the app",
      footerText: "Powered by Appopener.io",
      backgroundColor: "#ffffff",
      textColor: "#000000",
      accentColor: "#3b82f6",
      customCSS: "",
      customJS: "",
      adCode: '<div class="ad-space">Advertisement Space</div>',
      logoEnabled: true,
      logoUrl: "/abstract-logo.png",
      backgroundImageEnabled: false,
      backgroundImageUrl: "",
      videoEnabled: false,
      videoUrl: "",
      analyticsEnabled: true,
    })
    setIsAddTemplateOpen(false)
  }

  const handleEditTemplate = () => {
    if (!currentTemplate) return

    // If this is set as default, update other templates
    let updatedTemplates = [...templates]
    if (currentTemplate.isDefault) {
      updatedTemplates = updatedTemplates.map((template) => ({
        ...template,
        isDefault: template.id === currentTemplate.id ? true : false,
      }))
    }

    setTemplates(
      updatedTemplates.map((template) =>
        template.id === currentTemplate.id
          ? {
              ...currentTemplate,
              updatedAt: new Date().toISOString(),
            }
          : template,
      ),
    )
    setIsEditTemplateOpen(false)
    setCurrentTemplate(null)
  }

  const handleDeleteTemplate = (id: string) => {
    // Don't allow deleting the default template
    const templateToDelete = templates.find((t) => t.id === id)
    if (templateToDelete?.isDefault) {
      alert("Cannot delete the default template. Please set another template as default first.")
      return
    }

    setTemplates(templates.filter((template) => template.id !== id))
  }

  const handleDuplicateTemplate = (template: (typeof initialTemplates)[0]) => {
    const id = (templates.length + 1).toString()
    const createdAt = new Date().toISOString()
    const updatedAt = createdAt

    const duplicatedTemplate = {
      ...template,
      id,
      name: `${template.name} (Copy)`,
      isDefault: false,
      createdAt,
      updatedAt,
    }

    setTemplates([...templates, duplicatedTemplate])
  }

  const openEditDialog = (template: (typeof initialTemplates)[0]) => {
    setCurrentTemplate(template)
    setIsEditTemplateOpen(true)
    setActiveTab("appearance")
  }

  const openPreviewDialog = (template: (typeof initialTemplates)[0]) => {
    setCurrentTemplate(template)
    setIsPreviewOpen(true)
  }

  const setAsDefault = (id: string) => {
    setTemplates(
      templates.map((template) => ({
        ...template,
        isDefault: template.id === id,
      })),
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Redirect Page Templates</CardTitle>
            <CardDescription>Manage how your redirect pages look and function</CardDescription>
          </div>
          <Dialog open={isAddTemplateOpen} onOpenChange={setIsAddTemplateOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Create New Redirect Template</DialogTitle>
                <DialogDescription>
                  Design a new template for your redirect pages with custom styling and functionality.
                </DialogDescription>
              </DialogHeader>
              <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="appearance">Appearance</TabsTrigger>
                  <TabsTrigger value="content">Content</TabsTrigger>
                  <TabsTrigger value="media">Media & Ads</TabsTrigger>
                  <TabsTrigger value="advanced">Advanced</TabsTrigger>
                </TabsList>
                <TabsContent value="appearance" className="space-y-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Template Name</Label>
                      <Input
                        id="name"
                        value={newTemplate.name}
                        onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                        placeholder="e.g., Standard Redirect"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Input
                        id="description"
                        value={newTemplate.description}
                        onChange={(e) => setNewTemplate({ ...newTemplate, description: e.target.value })}
                        placeholder="Brief description of this template"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="backgroundColor">Background Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="backgroundColor"
                          type="color"
                          value={newTemplate.backgroundColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, backgroundColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={newTemplate.backgroundColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, backgroundColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="textColor">Text Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="textColor"
                          type="color"
                          value={newTemplate.textColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, textColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={newTemplate.textColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, textColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="accentColor">Accent Color</Label>
                      <div className="flex space-x-2">
                        <Input
                          id="accentColor"
                          type="color"
                          value={newTemplate.accentColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, accentColor: e.target.value })}
                          className="w-12 h-10 p-1"
                        />
                        <Input
                          value={newTemplate.accentColor}
                          onChange={(e) => setNewTemplate({ ...newTemplate, accentColor: e.target.value })}
                          className="flex-1"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adPlacement">Ad Placement</Label>
                      <Select
                        value={newTemplate.adPlacement}
                        onValueChange={(value) => setNewTemplate({ ...newTemplate, adPlacement: value })}
                      >
                        <SelectTrigger id="adPlacement">
                          <SelectValue placeholder="Select ad placement" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="top">Top</SelectItem>
                          <SelectItem value="center">Center</SelectItem>
                          <SelectItem value="bottom">Bottom</SelectItem>
                          <SelectItem value="side">Side</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Default Template</Label>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isDefault"
                        checked={newTemplate.isDefault}
                        onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, isDefault: checked as boolean })}
                      />
                      <label
                        htmlFor="isDefault"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Set as default template for all redirects
                      </label>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="content" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="headerText">Header Text</Label>
                      <Input
                        id="headerText"
                        value={newTemplate.headerText}
                        onChange={(e) => setNewTemplate({ ...newTemplate, headerText: e.target.value })}
                        placeholder="Text shown at the top of the redirect page"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="footerText">Footer Text</Label>
                      <Input
                        id="footerText"
                        value={newTemplate.footerText}
                        onChange={(e) => setNewTemplate({ ...newTemplate, footerText: e.target.value })}
                        placeholder="Text shown at the bottom of the redirect page"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="countdownDuration">Countdown Duration (seconds)</Label>
                      <div className="flex items-center space-x-4">
                        <Slider
                          id="countdownDuration"
                          min={1}
                          max={15}
                          step={1}
                          value={[newTemplate.countdownDuration]}
                          onValueChange={(value) => setNewTemplate({ ...newTemplate, countdownDuration: value[0] })}
                          className="flex-1"
                        />
                        <span className="w-12 text-center">{newTemplate.countdownDuration}s</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Countdown Options</Label>
                      <div className="grid grid-cols-1 gap-2">
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showSkipButton"
                            checked={newTemplate.showSkipButton}
                            onCheckedChange={(checked) =>
                              setNewTemplate({ ...newTemplate, showSkipButton: checked as boolean })
                            }
                          />
                          <label
                            htmlFor="showSkipButton"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Show skip button
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Checkbox
                            id="showProgressBar"
                            checked={newTemplate.showProgressBar}
                            onCheckedChange={(checked) =>
                              setNewTemplate({ ...newTemplate, showProgressBar: checked as boolean })
                            }
                          />
                          <label
                            htmlFor="showProgressBar"
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            Show progress bar
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="media" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="logoEnabled">Logo</Label>
                        <Switch
                          id="logoEnabled"
                          checked={newTemplate.logoEnabled}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, logoEnabled: checked })}
                        />
                      </div>
                      {newTemplate.logoEnabled && (
                        <Input
                          id="logoUrl"
                          value={newTemplate.logoUrl}
                          onChange={(e) => setNewTemplate({ ...newTemplate, logoUrl: e.target.value })}
                          placeholder="URL to your logo image"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="backgroundImageEnabled">Background Image</Label>
                        <Switch
                          id="backgroundImageEnabled"
                          checked={newTemplate.backgroundImageEnabled}
                          onCheckedChange={(checked) =>
                            setNewTemplate({ ...newTemplate, backgroundImageEnabled: checked })
                          }
                        />
                      </div>
                      {newTemplate.backgroundImageEnabled && (
                        <Input
                          id="backgroundImageUrl"
                          value={newTemplate.backgroundImageUrl}
                          onChange={(e) => setNewTemplate({ ...newTemplate, backgroundImageUrl: e.target.value })}
                          placeholder="URL to background image"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="videoEnabled">Video</Label>
                        <Switch
                          id="videoEnabled"
                          checked={newTemplate.videoEnabled}
                          onCheckedChange={(checked) => setNewTemplate({ ...newTemplate, videoEnabled: checked })}
                        />
                      </div>
                      {newTemplate.videoEnabled && (
                        <Input
                          id="videoUrl"
                          value={newTemplate.videoUrl}
                          onChange={(e) => setNewTemplate({ ...newTemplate, videoUrl: e.target.value })}
                          placeholder="URL to video (MP4)"
                          className="mt-2"
                        />
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adCode">Advertisement Code</Label>
                      <Textarea
                        id="adCode"
                        value={newTemplate.adCode}
                        onChange={(e) => setNewTemplate({ ...newTemplate, adCode: e.target.value })}
                        placeholder="HTML code for advertisements"
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="advanced" className="space-y-4 py-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="customCSS">Custom CSS</Label>
                      <Textarea
                        id="customCSS"
                        value={newTemplate.customCSS}
                        onChange={(e) => setNewTemplate({ ...newTemplate, customCSS: e.target.value })}
                        placeholder="Additional CSS styles"
                        className="min-h-[100px] font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="customJS">Custom JavaScript</Label>
                      <Textarea
                        id="customJS"
                        value={newTemplate.customJS}
                        onChange={(e) => setNewTemplate({ ...newTemplate, customJS: e.target.value })}
                        placeholder="Additional JavaScript code"
                        className="min-h-[100px] font-mono text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="analyticsEnabled"
                          checked={newTemplate.analyticsEnabled}
                          onCheckedChange={(checked) =>
                            setNewTemplate({ ...newTemplate, analyticsEnabled: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="analyticsEnabled"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Enable analytics tracking on this redirect page
                        </label>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddTemplateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddTemplate}>Create Template</Button>
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
              placeholder="Search templates..."
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
                <TableHead>Description</TableHead>
                <TableHead>Countdown</TableHead>
                <TableHead>Media</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTemplates.map((template) => (
                <TableRow key={template.id}>
                  <TableCell className="font-medium">{template.name}</TableCell>
                  <TableCell>{template.description}</TableCell>
                  <TableCell>{template.countdownDuration} seconds</TableCell>
                  <TableCell>
                    <div className="flex space-x-1">
                      {template.logoEnabled && (
                        <Badge variant="outline" className="bg-blue-50">
                          Logo
                        </Badge>
                      )}
                      {template.backgroundImageEnabled && (
                        <Badge variant="outline" className="bg-green-50">
                          BG Image
                        </Badge>
                      )}
                      {template.videoEnabled && (
                        <Badge variant="outline" className="bg-purple-50">
                          Video
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {template.isDefault ? <Badge>Default</Badge> : <Badge variant="outline">Custom</Badge>}
                  </TableCell>
                  <TableCell>{formatDate(template.updatedAt)}</TableCell>
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
                        <DropdownMenuItem onClick={() => openPreviewDialog(template)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Preview
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => openEditDialog(template)}>Edit template</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDuplicateTemplate(template)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Duplicate
                        </DropdownMenuItem>
                        {!template.isDefault && (
                          <DropdownMenuItem onClick={() => setAsDefault(template.id)}>Set as default</DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDeleteTemplate(template.id)}
                          disabled={template.isDefault}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete template
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
          Showing {filteredTemplates.length} of {templates.length} templates
        </div>
      </CardFooter>

      {/* Edit Template Dialog */}
      <Dialog open={isEditTemplateOpen} onOpenChange={setIsEditTemplateOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Redirect Template</DialogTitle>
            <DialogDescription>Modify the template settings and appearance.</DialogDescription>
          </DialogHeader>
          {currentTemplate && (
            <Tabs defaultValue="appearance" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="appearance">Appearance</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="media">Media & Ads</TabsTrigger>
                <TabsTrigger value="advanced">Advanced</TabsTrigger>
              </TabsList>
              <TabsContent value="appearance" className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-name">Template Name</Label>
                    <Input
                      id="edit-name"
                      value={currentTemplate.name}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-description">Description</Label>
                    <Input
                      id="edit-description"
                      value={currentTemplate.description}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, description: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-backgroundColor">Background Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="edit-backgroundColor"
                        type="color"
                        value={currentTemplate.backgroundColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, backgroundColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={currentTemplate.backgroundColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, backgroundColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-textColor">Text Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="edit-textColor"
                        type="color"
                        value={currentTemplate.textColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, textColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={currentTemplate.textColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, textColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-accentColor">Accent Color</Label>
                    <div className="flex space-x-2">
                      <Input
                        id="edit-accentColor"
                        type="color"
                        value={currentTemplate.accentColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, accentColor: e.target.value })}
                        className="w-12 h-10 p-1"
                      />
                      <Input
                        value={currentTemplate.accentColor}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, accentColor: e.target.value })}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-adPlacement">Ad Placement</Label>
                    <Select
                      value={currentTemplate.adPlacement}
                      onValueChange={(value) => setCurrentTemplate({ ...currentTemplate, adPlacement: value })}
                    >
                      <SelectTrigger id="edit-adPlacement">
                        <SelectValue placeholder="Select ad placement" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="top">Top</SelectItem>
                        <SelectItem value="center">Center</SelectItem>
                        <SelectItem value="bottom">Bottom</SelectItem>
                        <SelectItem value="side">Side</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Default Template</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="edit-isDefault"
                      checked={currentTemplate.isDefault}
                      onCheckedChange={(checked) =>
                        setCurrentTemplate({ ...currentTemplate, isDefault: checked as boolean })
                      }
                    />
                    <label
                      htmlFor="edit-isDefault"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Set as default template for all redirects
                    </label>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="content" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-headerText">Header Text</Label>
                    <Input
                      id="edit-headerText"
                      value={currentTemplate.headerText}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, headerText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-footerText">Footer Text</Label>
                    <Input
                      id="edit-footerText"
                      value={currentTemplate.footerText}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, footerText: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-countdownDuration">Countdown Duration (seconds)</Label>
                    <div className="flex items-center space-x-4">
                      <Slider
                        id="edit-countdownDuration"
                        min={1}
                        max={15}
                        step={1}
                        value={[currentTemplate.countdownDuration]}
                        onValueChange={(value) =>
                          setCurrentTemplate({ ...currentTemplate, countdownDuration: value[0] })
                        }
                        className="flex-1"
                      />
                      <span className="w-12 text-center">{currentTemplate.countdownDuration}s</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Countdown Options</Label>
                    <div className="grid grid-cols-1 gap-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-showSkipButton"
                          checked={currentTemplate.showSkipButton}
                          onCheckedChange={(checked) =>
                            setCurrentTemplate({ ...currentTemplate, showSkipButton: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="edit-showSkipButton"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show skip button
                        </label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="edit-showProgressBar"
                          checked={currentTemplate.showProgressBar}
                          onCheckedChange={(checked) =>
                            setCurrentTemplate({ ...currentTemplate, showProgressBar: checked as boolean })
                          }
                        />
                        <label
                          htmlFor="edit-showProgressBar"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Show progress bar
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="media" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-logoEnabled">Logo</Label>
                      <Switch
                        id="edit-logoEnabled"
                        checked={currentTemplate.logoEnabled}
                        onCheckedChange={(checked) => setCurrentTemplate({ ...currentTemplate, logoEnabled: checked })}
                      />
                    </div>
                    {currentTemplate.logoEnabled && (
                      <Input
                        id="edit-logoUrl"
                        value={currentTemplate.logoUrl}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, logoUrl: e.target.value })}
                        placeholder="URL to your logo image"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-backgroundImageEnabled">Background Image</Label>
                      <Switch
                        id="edit-backgroundImageEnabled"
                        checked={currentTemplate.backgroundImageEnabled}
                        onCheckedChange={(checked) =>
                          setCurrentTemplate({ ...currentTemplate, backgroundImageEnabled: checked })
                        }
                      />
                    </div>
                    {currentTemplate.backgroundImageEnabled && (
                      <Input
                        id="edit-backgroundImageUrl"
                        value={currentTemplate.backgroundImageUrl}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, backgroundImageUrl: e.target.value })}
                        placeholder="URL to background image"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="edit-videoEnabled">Video</Label>
                      <Switch
                        id="edit-videoEnabled"
                        checked={currentTemplate.videoEnabled}
                        onCheckedChange={(checked) => setCurrentTemplate({ ...currentTemplate, videoEnabled: checked })}
                      />
                    </div>
                    {currentTemplate.videoEnabled && (
                      <Input
                        id="edit-videoUrl"
                        value={currentTemplate.videoUrl}
                        onChange={(e) => setCurrentTemplate({ ...currentTemplate, videoUrl: e.target.value })}
                        placeholder="URL to video (MP4)"
                        className="mt-2"
                      />
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-adCode">Advertisement Code</Label>
                    <Textarea
                      id="edit-adCode"
                      value={currentTemplate.adCode}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, adCode: e.target.value })}
                      placeholder="HTML code for advertisements"
                      className="min-h-[100px]"
                    />
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="advanced" className="space-y-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-customCSS">Custom CSS</Label>
                    <Textarea
                      id="edit-customCSS"
                      value={currentTemplate.customCSS}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, customCSS: e.target.value })}
                      placeholder="Additional CSS styles"
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-customJS">Custom JavaScript</Label>
                    <Textarea
                      id="edit-customJS"
                      value={currentTemplate.customJS}
                      onChange={(e) => setCurrentTemplate({ ...currentTemplate, customJS: e.target.value })}
                      placeholder="Additional JavaScript code"
                      className="min-h-[100px] font-mono text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="edit-analyticsEnabled"
                        checked={currentTemplate.analyticsEnabled}
                        onCheckedChange={(checked) =>
                          setCurrentTemplate({ ...currentTemplate, analyticsEnabled: checked as boolean })
                        }
                      />
                      <label
                        htmlFor="edit-analyticsEnabled"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Enable analytics tracking on this redirect page
                      </label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditTemplateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditTemplate}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Preview Dialog */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Preview: {currentTemplate?.name}</DialogTitle>
            <DialogDescription>Preview how the redirect page will appear to users.</DialogDescription>
          </DialogHeader>
          {currentTemplate && <RedirectPagePreview template={currentTemplate} />}
          <DialogFooter>
            <Button onClick={() => setIsPreviewOpen(false)}>Close Preview</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  )
}
