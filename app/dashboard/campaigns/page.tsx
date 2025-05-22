"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { PlusCircle, Search, Calendar, Tag, ArrowUpRight, BarChart, Link2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getLinksAction } from "@/app/actions"
import { CampaignForm } from "@/components/dashboard/campaign-form"
import { useRouter } from "next/navigation"

interface CustomLink {
  id: string
  name: string
  url: string
  isNew: boolean
  clicks: number
  conversions: number
}

interface Campaign {
  id: string
  name: string
  status: "active" | "scheduled" | "completed" | "draft"
  type: "social" | "email" | "ads" | "content" | "other"
  startDate: string
  endDate: string | null
  clicks: number
  conversions: number
  links: number
  description?: string
  selectedLinks?: string[]
  customLinks?: CustomLink[]
  utmSource?: string
  utmMedium?: string
  utmCampaign?: string
  utmTerm?: string
  utmContent?: string
}

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])
  const [filteredCampaigns, setFilteredCampaigns] = useState<Campaign[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(null)
  const [showLinksDialog, setShowLinksDialog] = useState(false)
  const [selectedCampaignLinks, setSelectedCampaignLinks] = useState<CustomLink[]>([])
  const { toast } = useToast()
  const router = useRouter()

  // Mock data for campaigns
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setIsLoading(true)

        // In a real app, you would fetch campaigns from your API
        // For now, we'll use mock data
        const mockCampaigns: Campaign[] = [
          {
            id: "camp-1",
            name: "Summer Sale 2024",
            description: "Promote summer products with special discounts",
            status: "active",
            type: "social",
            startDate: "2024-05-15",
            endDate: "2024-06-15",
            clicks: 1245,
            conversions: 87,
            links: 5,
            selectedLinks: ["link-1", "link-2"],
            customLinks: [
              {
                id: "cl-1",
                name: "Facebook Ad",
                url: "https://example.com/summer-fb",
                isNew: false,
                clicks: 523,
                conversions: 32,
              },
              {
                id: "cl-2",
                name: "Instagram Post",
                url: "https://example.com/summer-ig",
                isNew: false,
                clicks: 412,
                conversions: 28,
              },
              {
                id: "cl-3",
                name: "Email Newsletter",
                url: "https://example.com/summer-email",
                isNew: false,
                clicks: 310,
                conversions: 27,
              },
            ],
            utmSource: "facebook",
            utmMedium: "social",
            utmCampaign: "summer_sale_2024",
          },
          {
            id: "camp-2",
            name: "Product Launch - Mobile App",
            description: "Launch campaign for our new mobile application",
            status: "scheduled",
            type: "email",
            startDate: "2024-06-01",
            endDate: null,
            clicks: 0,
            conversions: 0,
            links: 3,
            selectedLinks: ["link-3"],
            customLinks: [
              {
                id: "cl-4",
                name: "Press Release",
                url: "https://example.com/app-press",
                isNew: false,
                clicks: 0,
                conversions: 0,
              },
              {
                id: "cl-5",
                name: "Product Hunt",
                url: "https://example.com/app-ph",
                isNew: false,
                clicks: 0,
                conversions: 0,
              },
            ],
            utmSource: "email",
            utmMedium: "newsletter",
            utmCampaign: "app_launch",
          },
          {
            id: "camp-3",
            name: "Black Friday Promotion",
            status: "draft",
            type: "ads",
            startDate: "2024-11-20",
            endDate: "2024-11-30",
            clicks: 0,
            conversions: 0,
            links: 2,
            selectedLinks: ["link-4", "link-5"],
            customLinks: [
              {
                id: "cl-6",
                name: "Google Ads",
                url: "https://example.com/bf-google",
                isNew: false,
                clicks: 0,
                conversions: 0,
              },
              {
                id: "cl-7",
                name: "Facebook Ads",
                url: "https://example.com/bf-fb",
                isNew: false,
                clicks: 0,
                conversions: 0,
              },
            ],
          },
          {
            id: "camp-4",
            name: "Spring Collection",
            status: "completed",
            type: "social",
            startDate: "2024-03-01",
            endDate: "2024-04-15",
            clicks: 3567,
            conversions: 215,
            links: 8,
            selectedLinks: ["link-6", "link-7", "link-8"],
            customLinks: [
              {
                id: "cl-8",
                name: "Instagram Story",
                url: "https://example.com/spring-ig-story",
                isNew: false,
                clicks: 1245,
                conversions: 78,
              },
              {
                id: "cl-9",
                name: "TikTok",
                url: "https://example.com/spring-tiktok",
                isNew: false,
                clicks: 1876,
                conversions: 112,
              },
              {
                id: "cl-10",
                name: "Pinterest",
                url: "https://example.com/spring-pinterest",
                isNew: false,
                clicks: 446,
                conversions: 25,
              },
            ],
            utmSource: "instagram",
            utmMedium: "social",
            utmCampaign: "spring_collection",
          },
        ]

        // Also fetch links to ensure we have data for campaign creation
        await getLinksAction()

        setCampaigns(mockCampaigns)
        setFilteredCampaigns(mockCampaigns)
      } catch (error) {
        console.error("Error fetching campaigns:", error)
        toast({
          title: "Error",
          description: "Failed to load campaigns",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchCampaigns()
  }, [toast])

  // Filter campaigns based on search query and status filter
  useEffect(() => {
    let filtered = [...campaigns]

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((campaign) => campaign.name.toLowerCase().includes(searchQuery.toLowerCase()))
    }

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((campaign) => campaign.status === statusFilter)
    }

    setFilteredCampaigns(filtered)
  }, [searchQuery, statusFilter, campaigns])

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
      case "scheduled":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Scheduled</Badge>
      case "completed":
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">Completed</Badge>
      case "draft":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Draft</Badge>
      default:
        return null
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString()
  }

  const handleCreateCampaign = (data: any) => {
    // In a real app, you would send this data to your API
    // For now, we'll just add it to our local state
    const newCampaign: Campaign = {
      id: `camp-${campaigns.length + 1}`,
      name: data.name,
      description: data.description,
      status: data.status,
      type: data.type,
      startDate: data.startDate,
      endDate: data.endDate,
      clicks: 0,
      conversions: 0,
      links: data.selectedLinks.length + (data.customLinks?.length || 0),
      selectedLinks: data.selectedLinks,
      customLinks: data.customLinks?.map((link: any) => ({
        ...link,
        clicks: 0,
        conversions: 0,
      })),
      utmSource: data.utmSource,
      utmMedium: data.utmMedium,
      utmCampaign: data.utmCampaign,
      utmTerm: data.utmTerm,
      utmContent: data.utmContent,
    }

    setCampaigns((prev) => [newCampaign, ...prev])
    setIsCreateDialogOpen(false)

    toast({
      title: "Campaign Created",
      description: `Campaign "${data.name}" has been created successfully.`,
    })
  }

  const handleEditCampaign = (data: any) => {
    // In a real app, you would send this data to your API
    // For now, we'll just update our local state
    if (!selectedCampaign) return

    const updatedCampaigns = campaigns.map((campaign) => {
      if (campaign.id === selectedCampaign.id) {
        return {
          ...campaign,
          name: data.name,
          description: data.description,
          status: data.status,
          type: data.type,
          startDate: data.startDate,
          endDate: data.endDate,
          links: data.selectedLinks.length + (data.customLinks?.length || 0),
          selectedLinks: data.selectedLinks,
          customLinks: data.customLinks?.map((link: any) => ({
            ...link,
            clicks: link.clicks || 0,
            conversions: link.conversions || 0,
          })),
          utmSource: data.utmSource,
          utmMedium: data.utmMedium,
          utmCampaign: data.utmCampaign,
          utmTerm: data.utmTerm,
          utmContent: data.utmContent,
        }
      }
      return campaign
    })

    setCampaigns(updatedCampaigns)
    setIsEditDialogOpen(false)
    setSelectedCampaign(null)

    toast({
      title: "Campaign Updated",
      description: `Campaign "${data.name}" has been updated successfully.`,
    })
  }

  const handleEditClick = (campaign: Campaign) => {
    setSelectedCampaign(campaign)
    setIsEditDialogOpen(true)
  }

  const handleViewLinks = (campaign: Campaign) => {
    setSelectedCampaignLinks(campaign.customLinks || [])
    setSelectedCampaign(campaign)
    setShowLinksDialog(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Campaigns</h1>
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Create campaign
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Campaign Management</CardTitle>
          <CardDescription>
            Create and manage marketing campaigns to track performance across multiple links
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <Tag className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium">Total Campaigns</h3>
                <p className="text-2xl font-bold">{campaigns.length}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <ArrowUpRight className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-medium">Total Clicks</h3>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0).toLocaleString()}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 flex flex-col items-center text-center">
                <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                  <BarChart className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-medium">Conversion Rate</h3>
                <p className="text-2xl font-bold">
                  {campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0) > 0
                    ? `${(
                        (campaigns.reduce((sum, campaign) => sum + campaign.conversions, 0) /
                          campaigns.reduce((sum, campaign) => sum + campaign.clicks, 0)) *
                          100
                      ).toFixed(1)}%`
                    : "0%"}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search campaigns..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="scheduled">Scheduled</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All Campaigns</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="scheduled">Scheduled</TabsTrigger>
              <TabsTrigger value="draft">Drafts</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : filteredCampaigns.length > 0 ? (
                <div className="rounded-md border">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b bg-gray-50">
                          <th className="px-4 py-3 text-left font-medium">Campaign Name</th>
                          <th className="px-4 py-3 text-left font-medium">Status</th>
                          <th className="px-4 py-3 text-left font-medium">Type</th>
                          <th className="px-4 py-3 text-left font-medium">Start Date</th>
                          <th className="px-4 py-3 text-left font-medium">End Date</th>
                          <th className="px-4 py-3 text-left font-medium">Links</th>
                          <th className="px-4 py-3 text-left font-medium">Clicks</th>
                          <th className="px-4 py-3 text-left font-medium">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredCampaigns.map((campaign) => (
                          <tr key={campaign.id} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3 font-medium">{campaign.name}</td>
                            <td className="px-4 py-3">{getStatusBadge(campaign.status)}</td>
                            <td className="px-4 py-3 capitalize">{campaign.type}</td>
                            <td className="px-4 py-3">{formatDate(campaign.startDate)}</td>
                            <td className="px-4 py-3">{formatDate(campaign.endDate)}</td>
                            <td className="px-4 py-3">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 px-2 text-blue-600"
                                onClick={() => handleViewLinks(campaign)}
                              >
                                {campaign.links} links
                              </Button>
                            </td>
                            <td className="px-4 py-3">{campaign.clicks.toLocaleString()}</td>
                            <td className="px-4 py-3">
                              <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditClick(campaign)}>
                                  Edit
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => router.push(`/dashboard/campaigns/analytics/${campaign.id}`)}
                                  disabled={campaign.status === "draft" || campaign.status === "scheduled"}
                                >
                                  Analytics
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="h-12 w-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Calendar className="h-6 w-6 text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">No campaigns found</h3>
                  <p className="text-gray-500 mb-4">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your filters"
                      : "Create your first campaign to start tracking performance"}
                  </p>
                  <Button onClick={() => setIsCreateDialogOpen(true)}>Create campaign</Button>
                </div>
              )}
            </TabsContent>

            {/* Other tab contents would be similar but filtered by status */}
            <TabsContent value="active" className="mt-6">
              {/* Similar content as "all" but filtered for active campaigns */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Active campaigns view will be similar to the All tab but filtered for active campaigns.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="scheduled" className="mt-6">
              {/* Similar content as "all" but filtered for scheduled campaigns */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Scheduled campaigns view will be similar to the All tab but filtered for scheduled campaigns.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="draft" className="mt-6">
              {/* Similar content as "all" but filtered for draft campaigns */}
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p>Draft campaigns view will be similar to the All tab but filtered for draft campaigns.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Create Campaign Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <CampaignForm onSubmit={handleCreateCampaign} onCancel={() => setIsCreateDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Campaign Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Campaign</DialogTitle>
          </DialogHeader>
          {selectedCampaign && (
            <CampaignForm
              onSubmit={handleEditCampaign}
              onCancel={() => {
                setIsEditDialogOpen(false)
                setSelectedCampaign(null)
              }}
              initialData={selectedCampaign}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Campaign Links Dialog */}
      <Dialog open={showLinksDialog} onOpenChange={setShowLinksDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Campaign Links</DialogTitle>
          </DialogHeader>
          <div className="rounded-md border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium">Link Name</th>
                    <th className="px-4 py-3 text-left font-medium">URL</th>
                    <th className="px-4 py-3 text-left font-medium">Clicks</th>
                    <th className="px-4 py-3 text-left font-medium">Conversions</th>
                    <th className="px-4 py-3 text-left font-medium">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedCampaignLinks.length > 0 ? (
                    selectedCampaignLinks.map((link) => (
                      <tr key={link.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3 font-medium">{link.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1">
                            <Link2 className="h-3 w-3 flex-shrink-0" />
                            <span className="truncate max-w-[200px]">{link.url}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3">{link.clicks.toLocaleString()}</td>
                        <td className="px-4 py-3">{link.conversions.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          {link.clicks > 0 ? `${((link.conversions / link.clicks) * 100).toFixed(1)}%` : "0%"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        No links available for this campaign
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex justify-end">
            <Button onClick={() => setShowLinksDialog(false)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
