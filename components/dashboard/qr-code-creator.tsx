"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { generateQRCodeAction, getLinksAction, generateDeepLinkAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import QRCode from "qrcode"

interface QRCodeCreatorProps {
  onSuccess?: () => void
}

interface LinkOption {
  id: string
  label: string
  value: string
}

export function QRCodeCreator({ onSuccess }: QRCodeCreatorProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [linkId, setLinkId] = useState("")
  const [newUrl, setNewUrl] = useState("")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [size, setSize] = useState(300)
  const [isLoading, setIsLoading] = useState(false)
  const [linkOptions, setLinkOptions] = useState<LinkOption[]>([])
  const [isLoadingLinks, setIsLoadingLinks] = useState(true)
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<"existing" | "new">("existing")
  const { toast } = useToast()

  // Fetch existing links
  useEffect(() => {
    const fetchLinks = async () => {
      try {
        setIsLoadingLinks(true)
        const result = await getLinksAction()

        if (result.success) {
          const options = result.links.map((link) => ({
            id: link.id,
            label: link.originalUrl,
            value: link.id,
          }))
          setLinkOptions(options)

          // Set the first link as default if available
          if (options.length > 0 && !linkId && activeTab === "existing") {
            setLinkId(options[0].value)
          }
        }
      } catch (error) {
        console.error("Error fetching links:", error)
      } finally {
        setIsLoadingLinks(false)
      }
    }

    fetchLinks()
  }, [linkId, activeTab])

  // Generate preview QR code when settings change
  useEffect(() => {
    const generatePreview = async () => {
      try {
        // Only generate preview if we have a link selected or a new URL
        if ((activeTab === "existing" && linkId) || (activeTab === "new" && newUrl)) {
          let previewUrl = ""

          if (activeTab === "existing") {
            // Find the selected link
            const selectedLink = linkOptions.find((option) => option.value === linkId)
            if (!selectedLink) return

            // Use the base URL + slug for preview
            const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
            // Since we don't have the slug directly, we'll use a placeholder
            previewUrl = `${baseUrl}/r/preview`
          } else {
            // For new URLs, use the URL directly for preview
            previewUrl = newUrl
          }

          // Generate QR code data URL
          const dataUrl = await QRCode.toDataURL(previewUrl, {
            width: size,
            margin: 1,
            color: {
              dark: foregroundColor,
              light: backgroundColor,
            },
          })

          setPreviewDataUrl(dataUrl)
        }
      } catch (error) {
        console.error("Error generating preview:", error)
        // Don't show error toast for preview generation
      }
    }

    generatePreview()
  }, [linkId, newUrl, foregroundColor, backgroundColor, size, activeTab, linkOptions])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate form
    if (activeTab === "existing" && !linkId) {
      toast({
        title: "Error",
        description: "Please select a link",
        variant: "destructive",
      })
      return
    }

    if (activeTab === "new" && !newUrl) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    if (!name) {
      toast({
        title: "Error",
        description: "Please enter a name for your QR code",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      let targetLinkId = linkId

      // If creating a new URL, generate it first
      if (activeTab === "new") {
        const urlFormData = new FormData()
        urlFormData.append("url", newUrl)

        const urlResult = await generateDeepLinkAction(urlFormData)

        if (!urlResult.success) {
          toast({
            title: "Error",
            description: urlResult.error || "Failed to create URL",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        // Refresh links to get the new link ID
        const linksResult = await getLinksAction()

        if (linksResult.success) {
          // Find the newly created link (should be the first one)
          const newLink = linksResult.links[0]
          targetLinkId = newLink.id
        } else {
          toast({
            title: "Error",
            description: "Failed to retrieve the newly created link",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }
      }

      // Create QR code with the link ID
      const formData = new FormData()
      formData.append("linkId", targetLinkId)
      formData.append("name", name)
      formData.append("description", description)
      formData.append("foregroundColor", foregroundColor)
      formData.append("backgroundColor", backgroundColor)
      formData.append("size", size.toString())

      const result = await generateQRCodeAction(formData)

      if (result.success) {
        toast({
          title: "QR code created",
          description: "Your QR code has been generated successfully",
        })

        // Reset form
        setName("")
        setDescription("")
        setNewUrl("")
        setForegroundColor("#000000")
        setBackgroundColor("#FFFFFF")
        setSize(300)
        setPreviewDataUrl(null)

        if (onSuccess) {
          onSuccess()
        }
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate QR code",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating QR code:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "existing" | "new")}>
            <TabsList className="mb-2">
              <TabsTrigger value="existing">Use Existing Link</TabsTrigger>
              <TabsTrigger value="new">Create New Link</TabsTrigger>
            </TabsList>

            <TabsContent value="existing" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link">Select Link</Label>
                <Select value={linkId} onValueChange={setLinkId} disabled={isLoadingLinks}>
                  <SelectTrigger id="link">
                    <SelectValue placeholder="Select a link" />
                  </SelectTrigger>
                  <SelectContent>
                    {linkOptions.map((option) => (
                      <SelectItem key={option.id} value={option.value}>
                        {option.label.length > 40 ? option.label.substring(0, 40) + "..." : option.label}
                      </SelectItem>
                    ))}
                    {linkOptions.length === 0 && (
                      <SelectItem value="no-links" disabled>
                        No links available
                      </SelectItem>
                    )}
                  </SelectContent>
                </Select>
                {linkOptions.length === 0 && !isLoadingLinks && (
                  <p className="text-xs text-red-500">
                    You need to create a link first or switch to "Create New Link" tab.
                  </p>
                )}
              </div>
            </TabsContent>

            <TabsContent value="new" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="newUrl">Enter URL</Label>
                <Input
                  id="newUrl"
                  type="url"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com"
                  required={activeTab === "new"}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="name">QR Code Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter a name for your QR code"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a description for your QR code"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="foregroundColor">Foreground Color</Label>
              <div className="flex gap-2">
                <Input
                  id="foregroundColor"
                  type="color"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={foregroundColor}
                  onChange={(e) => setForegroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="backgroundColor">Background Color</Label>
              <div className="flex gap-2">
                <Input
                  id="backgroundColor"
                  type="color"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="w-12 h-10 p-1"
                />
                <Input
                  type="text"
                  value={backgroundColor}
                  onChange={(e) => setBackgroundColor(e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="size">Size: {size}px</Label>
            </div>
            <Slider
              id="size"
              min={100}
              max={800}
              step={10}
              value={[size]}
              onValueChange={(value) => setSize(value[0])}
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>100px</span>
              <span>800px</span>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={
              isLoading || (activeTab === "existing" && linkOptions.length === 0) || (activeTab === "new" && !newUrl)
            }
          >
            {isLoading ? "Generating..." : "Generate QR Code"}
          </Button>
        </form>
      </div>

      <div>
        <Card>
          <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
            {previewDataUrl ? (
              <div className="text-center">
                <h3 className="text-lg font-medium mb-4">Live Preview</h3>
                <img src={previewDataUrl || "/placeholder.svg"} alt="QR Code Preview" className="max-w-full mx-auto" />
                <p className="text-sm text-gray-500 mt-4">
                  This is a preview of your QR code. The final QR code will be generated when you click "Generate QR
                  Code".
                </p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-48 h-48 mx-auto border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center mb-4">
                  <p className="text-gray-500">QR Code Preview</p>
                </div>
                <p className="text-sm text-gray-500">
                  {activeTab === "existing"
                    ? linkId
                      ? "Generating preview..."
                      : "Select a link to see a preview"
                    : newUrl
                      ? "Generating preview..."
                      : "Enter a URL to see a preview"}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
