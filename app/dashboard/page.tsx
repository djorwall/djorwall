"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, QrCode } from "lucide-react"
import { getLinksAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { LinkCreator } from "@/components/dashboard/link-creator"
import { CampaignAnalyticsSummary } from "@/components/dashboard/campaign-analytics-summary"

interface LinkData {
  id: string
  originalUrl: string
  shortLink: string
  createdAt: string
  clicks: number
}

export default function DashboardPage() {
  const [links, setLinks] = useState<LinkData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  const fetchLinks = async () => {
    try {
      setIsLoading(true)
      const result = await getLinksAction()

      if (result.success) {
        setLinks(result.links)
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to fetch links",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error fetching links:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [])

  // Calculate completion percentage for getting started
  const totalSteps = 4
  const completedSteps = links.length > 0 ? 1 : 0
  const completionPercentage = Math.round((completedSteps / totalSteps) * 100)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Your Connections Platform</h1>
        <div className="mt-2 flex items-center text-sm text-blue-600">
          <span>Get premium features with our Pro plan.</span>
          <Button variant="link" className="h-auto p-0 pl-1">
            Upgrade now
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="relative w-full max-w-[200px] h-12 bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
                <span className="text-sm font-medium">appopener.io/r/link</span>
              </div>
              <div className="absolute top-1 right-1 bg-blue-600 rounded-full p-1">
                <Check className="h-3 w-3 text-white" />
              </div>
            </div>
            <h3 className="text-lg font-semibold">Make it short</h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/links">Go to links</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
            <div className="w-full max-w-[200px] h-12 bg-gray-100 rounded-md flex items-center justify-center">
              <QrCode className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold">Make it scannable</h3>
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard/qr-codes">Go to Codes</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Getting started with Appopener</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">{completionPercentage}%</span>
              <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${completionPercentage}%` }}></div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div
                className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${links.length > 0 ? "bg-green-100 text-green-600" : "border border-gray-300"}`}
              >
                {links.length > 0 ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                )}
              </div>
              <div className="space-y-2">
                <div className={`font-medium ${links.length > 0 ? "line-through text-gray-500" : ""}`}>
                  Make an Appopener Link
                </div>
                {links.length === 0 && <LinkCreator onSuccess={fetchLinks} />}
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Make an Appopener QR Code</div>
                <Button asChild variant="outline" size="sm">
                  <Link href="/dashboard/qr-codes">Create a QR Code</Link>
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Click it, scan it, or share it</div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/links">View your links</Link>
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/qr-codes">View your QR Codes</Link>
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center">
                <span className="h-2 w-2 rounded-full bg-gray-300"></span>
              </div>
              <div className="space-y-2">
                <div className="font-medium">Check out Appopener Analytics</div>
                <div className="flex gap-2">
                  <Button asChild variant="outline" size="sm">
                    <Link href="/dashboard/analytics">View Analytics demo</Link>
                  </Button>
                  <Button asChild variant="link" size="sm">
                    <Link href="/pricing">View plans</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <CampaignAnalyticsSummary campaignId="camp-1" campaignName="Summer Sale 2024" />

          <div className="bg-white border rounded-lg p-6 space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold">Upgrade to Pro</h3>
              <p className="text-gray-500">Get access to premium features.</p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="h-4 w-4 text-green-500" />
                <span>Unlimited link creation</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="h-4 w-4 text-green-500" />
                <span>Advanced analytics</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="h-4 w-4 text-green-500" />
                <span>QR code customization</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Check className="h-4 w-4 text-green-500" />
                <span>Link expiration options</span>
              </div>
            </div>

            <Button className="w-full">View our plans</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
