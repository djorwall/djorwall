"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowUpRight, BarChart2, ExternalLink, Link2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface CampaignAnalyticsSummaryProps {
  campaignId: string
}

interface ShortLink {
  id: string
  name: string
  shortLink: string
  clicks: number
  conversions: number
}

interface Campaign {
  id: string
  name: string
  sourceUrl: string
  status: string
  startDate: string
  endDate: string | null
  totalClicks: number
  totalConversions: number
  conversionRate: number
  shortLinks: ShortLink[]
}

export function CampaignAnalyticsSummary({ campaignId }: CampaignAnalyticsSummaryProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [campaign, setCampaign] = useState<Campaign | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchCampaignData = async () => {
      setIsLoading(true)

      // In a real app, you would fetch this data from your API
      // For now, we'll use mock data
      setTimeout(() => {
        const mockCampaign: Campaign = {
          id: campaignId,
          name: "Summer Sale 2024",
          sourceUrl: "https://example.com/summer-sale",
          status: "active",
          startDate: "2024-05-15",
          endDate: "2024-06-15",
          totalClicks: 1245,
          totalConversions: 87,
          conversionRate: 6.99,
          shortLinks: [
            {
              id: "link-1",
              name: "Facebook Ad",
              shortLink: "https://appopener.io/r/fb123",
              clicks: 523,
              conversions: 32,
            },
            {
              id: "link-2",
              name: "Instagram Post",
              shortLink: "https://appopener.io/r/ig456",
              clicks: 412,
              conversions: 28,
            },
            {
              id: "link-3",
              name: "Email Newsletter",
              shortLink: "https://appopener.io/r/em789",
              clicks: 310,
              conversions: 27,
            },
          ],
        }

        setCampaign(mockCampaign)
        setIsLoading(false)
      }, 1000)
    }

    fetchCampaignData()
  }, [campaignId])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-6">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!campaign) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Campaign Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <p className="text-gray-500">Campaign data not available</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Campaign Performance</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          className="text-blue-600"
          onClick={() => router.push(`/dashboard/campaigns/analytics/${campaignId}`)}
        >
          View Details
          <ArrowUpRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium">{campaign.name}</h3>
            <Badge
              className={
                campaign.status === "active"
                  ? "bg-green-100 text-green-800"
                  : campaign.status === "scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : campaign.status === "completed"
                      ? "bg-gray-100 text-gray-800"
                      : "bg-yellow-100 text-yellow-800"
              }
            >
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <ExternalLink className="h-3.5 w-3.5 mr-1" />
            <a href={campaign.sourceUrl} target="_blank" rel="noopener noreferrer" className="hover:underline truncate">
              {campaign.sourceUrl}
            </a>
          </div>
          <div className="text-sm text-gray-500">
            {new Date(campaign.startDate).toLocaleDateString()} -{" "}
            {campaign.endDate ? new Date(campaign.endDate).toLocaleDateString() : "Ongoing"}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{campaign.totalClicks.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Total Clicks</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{campaign.totalConversions.toLocaleString()}</div>
            <div className="text-xs text-gray-500">Conversions</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md text-center">
            <div className="text-2xl font-bold">{campaign.conversionRate.toFixed(1)}%</div>
            <div className="text-xs text-gray-500">Conv. Rate</div>
          </div>
        </div>

        <Tabs defaultValue="links">
          <TabsList className="w-full">
            <TabsTrigger value="links" className="flex-1">
              Short Links
            </TabsTrigger>
            <TabsTrigger value="chart" className="flex-1">
              Performance
            </TabsTrigger>
          </TabsList>
          <TabsContent value="links" className="mt-4">
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {campaign.shortLinks.map((link) => (
                <div key={link.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-md">
                  <div className="flex items-center">
                    <Link2 className="h-4 w-4 mr-2 text-blue-600" />
                    <div>
                      <div className="font-medium text-sm">{link.name}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{link.shortLink}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">{link.clicks.toLocaleString()}</div>
                    <div className="text-xs text-gray-500">clicks</div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="chart" className="mt-4">
            <div className="h-40 flex items-center justify-center">
              <div className="flex flex-col items-center text-gray-500">
                <BarChart2 className="h-8 w-8 mb-2" />
                <span className="text-sm">Performance chart will appear here</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
