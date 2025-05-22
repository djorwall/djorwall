"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import Link from "next/link"

interface CampaignSummaryProps {
  campaigns?: {
    id: string
    name: string
    status: "active" | "scheduled" | "completed" | "draft"
    clicks: number
  }[]
}

export function CampaignSummary({ campaigns = [] }: CampaignSummaryProps) {
  // If no campaigns are provided, use some default data
  const displayCampaigns =
    campaigns.length > 0
      ? campaigns
      : [
          {
            id: "camp-1",
            name: "Summer Sale 2024",
            status: "active",
            clicks: 1245,
          },
          {
            id: "camp-2",
            name: "Product Launch - Mobile App",
            status: "scheduled",
            clicks: 0,
          },
        ]

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-md font-medium">Recent Campaigns</CardTitle>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/campaigns" className="gap-1">
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayCampaigns.slice(0, 3).map((campaign) => (
            <div key={campaign.id} className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0">
              <div className="space-y-1">
                <div className="font-medium">{campaign.name}</div>
                <div className="flex items-center gap-2">
                  {getStatusBadge(campaign.status)}
                  <span className="text-xs text-gray-500">{campaign.clicks.toLocaleString()} clicks</span>
                </div>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/dashboard/campaigns?id=${campaign.id}`}>Details</Link>
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
