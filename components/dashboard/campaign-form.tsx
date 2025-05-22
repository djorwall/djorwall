"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertCircle,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
  Download,
  FileSpreadsheet,
  Link2,
  Upload,
} from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { createCampaignLinkAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface CampaignFormProps {
  onSubmit: (data: any) => void
  onCancel: () => void
  initialData?: any
}

interface ShortLink {
  id: string
  name: string
}

export function CampaignForm({ onSubmit, onCancel, initialData }: CampaignFormProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    description: initialData?.description || "",
    type: initialData?.type || "social",
    status: initialData?.status || "draft",
    sourceUrl: initialData?.sourceUrl || "",
    startDate: initialData?.startDate ? new Date(initialData.startDate) : new Date(),
    endDate: initialData?.endDate ? new Date(initialData.endDate) : null,
    hasEndDate: !!initialData?.endDate,
    isPaid: initialData?.isPaid || false,
    utmSource: initialData?.utmSource || "",
    utmMedium: initialData?.utmMedium || "",
    utmCampaign: initialData?.utmCampaign || "",
    utmTerm: initialData?.utmTerm || "",
    utmContent: initialData?.utmContent || "",
    linkCount: initialData?.shortLinks?.length || 1,
    shortLinks: initialData?.shortLinks || [{ id: "new-1", name: "Link 1" }],
  })

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [importErrors, setImportErrors] = useState<string[]>([])
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const totalSteps = 5

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error for this field if it exists
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handleLinkNameChange = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      shortLinks: prev.shortLinks.map((link) => (link.id === id ? { ...link, name: value } : link)),
    }))
  }

  const updateLinkCount = (count: number) => {
    const newCount = Math.max(1, Math.min(50, count))

    // Get current short links
    const currentLinks = [...formData.shortLinks]

    // If increasing, add new links
    if (newCount > currentLinks.length) {
      const additionalLinks = Array.from({ length: newCount - currentLinks.length }, (_, i) => ({
        id: `new-${currentLinks.length + i + 1}`,
        name: `Link ${currentLinks.length + i + 1}`,
      }))

      setFormData((prev) => ({
        ...prev,
        linkCount: newCount,
        shortLinks: [...prev.shortLinks, ...additionalLinks],
      }))
    }
    // If decreasing, remove links from the end
    else if (newCount < currentLinks.length) {
      setFormData((prev) => ({
        ...prev,
        linkCount: newCount,
        shortLinks: prev.shortLinks.slice(0, newCount),
      }))
    }
  }

  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {}

    if (currentStep === 1) {
      if (!formData.name.trim()) {
        newErrors.name = "Campaign name is required"
      }
    } else if (currentStep === 2) {
      if (!formData.sourceUrl.trim()) {
        newErrors.sourceUrl = "Source URL is required"
      } else if (!/^https?:\/\/.+/.test(formData.sourceUrl)) {
        newErrors.sourceUrl = "Please enter a valid URL starting with http:// or https://"
      }
    } else if (currentStep === 3) {
      if (formData.hasEndDate && formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
        newErrors.endDate = "End date must be after start date"
      }
    } else if (currentStep === 4) {
      // UTM validation only if it's a paid campaign
      if (formData.isPaid) {
        if (!formData.utmSource.trim()) {
          newErrors.utmSource = "UTM Source is required for paid campaigns"
        }
        if (!formData.utmMedium.trim()) {
          newErrors.utmMedium = "UTM Medium is required for paid campaigns"
        }
        if (!formData.utmCampaign.trim()) {
          newErrors.utmCampaign = "UTM Campaign is required for paid campaigns"
        }
      }
    } else if (currentStep === 5) {
      // Validate link names
      formData.shortLinks.forEach((link, index) => {
        if (!link.name.trim()) {
          newErrors[`link-${index}`] = "Link name is required"
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (validateCurrentStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps))
    }
  }

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Final validation before submission
    const allErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      allErrors.name = "Campaign name is required"
    }

    if (!formData.sourceUrl.trim()) {
      allErrors.sourceUrl = "Source URL is required"
    } else if (!/^https?:\/\/.+/.test(formData.sourceUrl)) {
      allErrors.sourceUrl = "Please enter a valid URL starting with http:// or https://"
    }

    if (formData.hasEndDate && formData.endDate && formData.startDate && formData.endDate < formData.startDate) {
      allErrors.endDate = "End date must be after start date"
    }

    if (formData.isPaid) {
      if (!formData.utmSource.trim()) {
        allErrors.utmSource = "UTM Source is required for paid campaigns"
      }
      if (!formData.utmMedium.trim()) {
        allErrors.utmMedium = "UTM Medium is required for paid campaigns"
      }
      if (!formData.utmCampaign.trim()) {
        allErrors.utmCampaign = "UTM Campaign is required for paid campaigns"
      }
    }

    formData.shortLinks.forEach((link, index) => {
      if (!link.name.trim()) {
        allErrors[`link-${index}`] = "Link name is required"
      }
    })

    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors)
      toast({
        title: "Validation Error",
        description: "Please fix the errors in the form",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Create all the short links
      const createdLinks = []

      for (const link of formData.shortLinks) {
        // Construct the final URL with UTM parameters if this is a paid campaign
        let finalUrl = formData.sourceUrl

        if (formData.isPaid) {
          const url = new URL(formData.sourceUrl)
          url.searchParams.append("utm_source", formData.utmSource)
          url.searchParams.append("utm_medium", formData.utmMedium)
          url.searchParams.append("utm_campaign", formData.utmCampaign)

          if (formData.utmTerm) {
            url.searchParams.append("utm_term", formData.utmTerm)
          }

          if (formData.utmContent) {
            url.searchParams.append("utm_content", formData.utmContent)
          }

          finalUrl = url.toString()
        }

        // In a real implementation, we would create the short links here
        // For now, we'll simulate it
        try {
          const result = await createCampaignLinkAction(finalUrl, link.name)
          if (result.success) {
            createdLinks.push({
              id: result.id,
              name: link.name,
              shortLink: result.shortLink,
              originalUrl: result.originalUrl,
            })
          }
        } catch (error) {
          console.error("Error creating link:", error)
        }
      }

      // Prepare data for submission
      const submissionData = {
        ...formData,
        createdLinks,
        endDate: formData.hasEndDate ? formData.endDate : null,
        // Convert dates to ISO strings for API
        startDate: formData.startDate.toISOString().split("T")[0],
        endDate: formData.hasEndDate && formData.endDate ? formData.endDate.toISOString().split("T")[0] : null,
      }

      // Remove the hasEndDate field as it's just for UI control
      delete submissionData.hasEndDate

      onSubmit(submissionData)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to create campaign",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const autoFillUtm = () => {
    handleChange("utmSource", formData.name.toLowerCase().replace(/\s+/g, "_"))
    handleChange("utmMedium", formData.type)
    handleChange("utmCampaign", formData.name.toLowerCase().replace(/\s+/g, "_"))
  }

  // CSV Import Functions
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const csvData = event.target?.result as string
        const importedLinks = parseCSV(csvData)

        if (importedLinks.length === 0) {
          setImportErrors(["No valid link names found in the file"])
          return
        }

        // Update form data with imported links
        const newLinks = importedLinks.map((name, index) => ({
          id: `imported-${index + 1}`,
          name: name,
        }))

        setFormData((prev) => ({
          ...prev,
          linkCount: newLinks.length,
          shortLinks: newLinks,
        }))

        setIsImportDialogOpen(false)
        toast({
          title: "Import Successful",
          description: `Imported ${newLinks.length} link names`,
        })

        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
      } catch (error) {
        console.error("Error parsing CSV:", error)
        setImportErrors(["Failed to parse the file. Please check the format and try again."])
      }
    }

    reader.onerror = () => {
      setImportErrors(["Error reading the file. Please try again."])
    }

    reader.readAsText(file)
  }

  const parseCSV = (csvData: string): string[] => {
    setImportErrors([])
    const errors: string[] = []

    // Split by newlines and filter out empty lines
    const lines = csvData.split(/\r?\n/).filter((line) => line.trim() !== "")

    // Process each line
    const linkNames: string[] = []

    lines.forEach((line, index) => {
      // Remove quotes if present and trim whitespace
      const name = line.replace(/^["'](.*)["']$/, "$1").trim()

      if (name) {
        linkNames.push(name)
      } else {
        errors.push(`Line ${index + 1}: Empty link name`)
      }
    })

    if (errors.length > 0) {
      setImportErrors(errors)
    }

    return linkNames
  }

  const downloadSampleCSV = () => {
    const sampleData = "Facebook Post\nInstagram Story\nEmail Newsletter\nTwitter Ad\nLinkedIn Post"
    const blob = new Blob([sampleData], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "sample_link_names.csv"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <div
              key={index}
              className={cn("h-2 w-2 rounded-full", currentStep > index ? "bg-blue-600" : "bg-gray-300")}
            />
          ))}
        </div>
        <div className="text-sm text-gray-500">
          Step {currentStep} of {totalSteps}
        </div>
      </div>

      {/* Step 1: Campaign Details */}
      {currentStep === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Campaign Details</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                Campaign Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Summer Sale 2024"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Campaign Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                placeholder="Describe your campaign purpose and goals"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Campaign Type</Label>
              <Select value={formData.type} onValueChange={(value) => handleChange("type", value)}>
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="email">Email Marketing</SelectItem>
                  <SelectItem value="ads">Paid Advertising</SelectItem>
                  <SelectItem value="content">Content Marketing</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Campaign Status</Label>
              <Select value={formData.status} onValueChange={(value) => handleChange("status", value)}>
                <SelectTrigger id="status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="scheduled">Scheduled</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Source URL */}
      {currentStep === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Source URL</h3>
          <p className="text-sm text-gray-500">
            Enter the destination URL where all your shortened links will redirect to.
          </p>

          <div className="space-y-2">
            <Label htmlFor="sourceUrl">
              Source URL <span className="text-red-500">*</span>
            </Label>
            <Input
              id="sourceUrl"
              value={formData.sourceUrl}
              onChange={(e) => handleChange("sourceUrl", e.target.value)}
              placeholder="https://example.com/landing-page"
              className={errors.sourceUrl ? "border-red-500" : ""}
            />
            {errors.sourceUrl && <p className="text-sm text-red-500">{errors.sourceUrl}</p>}
          </div>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">About Source URLs</h4>
                <p className="text-sm text-blue-700 mt-1">
                  This is the main URL that all your shortened links will point to. You'll be able to create multiple
                  shortened links for this URL to track different traffic sources.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: Campaign Schedule */}
      {currentStep === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Campaign Schedule</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => handleChange("startDate", date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="endDate" className={!formData.hasEndDate ? "text-gray-400" : ""}>
                  End Date
                </Label>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="hasEndDate"
                    checked={formData.hasEndDate}
                    onChange={(e) => handleChange("hasEndDate", e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Label htmlFor="hasEndDate" className="text-sm font-normal">
                    Set end date
                  </Label>
                </div>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      (!formData.endDate || !formData.hasEndDate) && "text-muted-foreground",
                    )}
                    disabled={!formData.hasEndDate}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.hasEndDate && formData.endDate ? (
                      format(formData.endDate, "PPP")
                    ) : (
                      <span>No end date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate || undefined}
                    onSelect={(date) => handleChange("endDate", date)}
                    disabled={(date) => date < (formData.startDate || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: UTM Parameters */}
      {currentStep === 4 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">UTM Parameters</h3>
            <Button type="button" variant="outline" size="sm" onClick={autoFillUtm}>
              Auto-fill
            </Button>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isPaid"
                checked={formData.isPaid}
                onChange={(e) => handleChange("isPaid", e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="isPaid" className="text-sm font-normal">
                This is a paid campaign (requires UTM parameters)
              </Label>
            </div>
          </div>

          <div className={cn("space-y-4", !formData.isPaid && "opacity-50")}>
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="utmSource" className={formData.isPaid ? "" : "text-gray-400"}>
                  UTM Source {formData.isPaid && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="utmSource"
                  value={formData.utmSource}
                  onChange={(e) => handleChange("utmSource", e.target.value)}
                  placeholder="facebook"
                  disabled={!formData.isPaid}
                  className={errors.utmSource ? "border-red-500" : ""}
                />
                {errors.utmSource && <p className="text-sm text-red-500">{errors.utmSource}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmMedium" className={formData.isPaid ? "" : "text-gray-400"}>
                  UTM Medium {formData.isPaid && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="utmMedium"
                  value={formData.utmMedium}
                  onChange={(e) => handleChange("utmMedium", e.target.value)}
                  placeholder="cpc"
                  disabled={!formData.isPaid}
                  className={errors.utmMedium ? "border-red-500" : ""}
                />
                {errors.utmMedium && <p className="text-sm text-red-500">{errors.utmMedium}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="utmCampaign" className={formData.isPaid ? "" : "text-gray-400"}>
                  UTM Campaign {formData.isPaid && <span className="text-red-500">*</span>}
                </Label>
                <Input
                  id="utmCampaign"
                  value={formData.utmCampaign}
                  onChange={(e) => handleChange("utmCampaign", e.target.value)}
                  placeholder="summer_sale"
                  disabled={!formData.isPaid}
                  className={errors.utmCampaign ? "border-red-500" : ""}
                />
                {errors.utmCampaign && <p className="text-sm text-red-500">{errors.utmCampaign}</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="utmTerm" className={formData.isPaid ? "" : "text-gray-400"}>
                    UTM Term (Optional)
                  </Label>
                  <Input
                    id="utmTerm"
                    value={formData.utmTerm}
                    onChange={(e) => handleChange("utmTerm", e.target.value)}
                    placeholder="running_shoes"
                    disabled={!formData.isPaid}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="utmContent" className={formData.isPaid ? "" : "text-gray-400"}>
                    UTM Content (Optional)
                  </Label>
                  <Input
                    id="utmContent"
                    value={formData.utmContent}
                    onChange={(e) => handleChange("utmContent", e.target.value)}
                    placeholder="banner_blue"
                    disabled={!formData.isPaid}
                  />
                </div>
              </div>
            </div>
          </div>

          {!formData.isPaid && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-600">
                UTM parameters are not required for non-paid campaigns. If you need to track traffic sources, enable the
                "paid campaign" option above.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Step 5: Create Short Links */}
      {currentStep === 5 && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Create Short Links</h3>
            <div className="flex gap-2">
              <Dialog open={isImportDialogOpen} onOpenChange={setIsImportDialogOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <FileSpreadsheet className="h-4 w-4 mr-2" />
                    Import from CSV
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Import Link Names from CSV</DialogTitle>
                    <DialogDescription>
                      Upload a CSV file with one link name per line to quickly create multiple links.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="space-y-4 py-4">
                    {importErrors.length > 0 && (
                      <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>
                          <ul className="list-disc pl-4 mt-2">
                            {importErrors.map((error, index) => (
                              <li key={index}>{error}</li>
                            ))}
                          </ul>
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6">
                      <FileSpreadsheet className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-sm text-gray-500 mb-4">Drag and drop your CSV file here, or click to browse</p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".csv,.txt"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="csv-upload"
                      />
                      <Button variant="outline" onClick={() => fileInputRef.current?.click()} className="mb-2">
                        <Upload className="h-4 w-4 mr-2" />
                        Select File
                      </Button>
                      <p className="text-xs text-gray-400">File should contain one link name per line</p>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <p className="text-sm text-gray-500">Need a template?</p>
                      <Button variant="link" size="sm" onClick={downloadSampleCSV}>
                        <Download className="h-4 w-4 mr-1" />
                        Download Sample CSV
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>

          <p className="text-sm text-gray-500">
            Create multiple shortened links that all point to your source URL. Each link can be used for different
            channels or placements.
          </p>

          <div className="space-y-2">
            <Label htmlFor="linkCount">Number of Links to Create</Label>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateLinkCount(formData.linkCount - 1)}
                disabled={formData.linkCount <= 1}
              >
                -
              </Button>
              <Input
                id="linkCount"
                type="number"
                min="1"
                max="50"
                value={formData.linkCount}
                onChange={(e) => updateLinkCount(Number.parseInt(e.target.value) || 1)}
                className="w-20 text-center"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => updateLinkCount(formData.linkCount + 1)}
                disabled={formData.linkCount >= 50}
              >
                +
              </Button>
            </div>
          </div>

          <Card>
            <CardContent className="p-4 max-h-80 overflow-y-auto">
              <div className="space-y-3">
                {formData.shortLinks.map((link, index) => (
                  <div key={link.id} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                      <Link2 className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder={`Link name (e.g. Facebook Ad ${index + 1})`}
                        value={link.name}
                        onChange={(e) => handleLinkNameChange(link.id, e.target.value)}
                        className={errors[`link-${index}`] ? "border-red-500" : ""}
                      />
                      {errors[`link-${index}`] && (
                        <p className="text-xs text-red-500 mt-1">{errors[`link-${index}`]}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="bg-blue-50 p-4 rounded-md">
            <div className="flex items-start">
              <div className="mr-3 mt-0.5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div>
                <h4 className="text-sm font-medium text-blue-800">About Short Links</h4>
                <p className="text-sm text-blue-700 mt-1">
                  Each short link will redirect to your source URL. Give each link a descriptive name to help you
                  identify where it will be used (e.g., "Facebook Post", "Email Newsletter", "Instagram Bio").
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={currentStep === 1 ? onCancel : prevStep} disabled={isLoading}>
          {currentStep === 1 ? (
            "Cancel"
          ) : (
            <>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back
            </>
          )}
        </Button>
        <Button type="button" onClick={currentStep === totalSteps ? handleSubmit : nextStep} disabled={isLoading}>
          {isLoading ? (
            <>
              <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
              {currentStep === totalSteps ? (initialData ? "Updating..." : "Creating...") : "Loading..."}
            </>
          ) : (
            <>
              {currentStep === totalSteps ? (
                initialData ? (
                  "Update Campaign"
                ) : (
                  "Create Campaign"
                )
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
