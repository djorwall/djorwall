import Link from "next/link"
import { ArrowLeft, Download, Eye, Lock, Share2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { InfluencerCard } from "@/components/dashboard/influencer-card"

// Sample data for the sheet
const sheetData = {
  id: 1,
  name: "Fashion Influencers 2024",
  description: "A curated list of top fashion influencers for your next campaign.",
  agent: {
    name: "Sarah Johnson",
    company: "Elite Talent Management",
    avatar: "/professional-woman-short-hair.png",
    verified: true,
  },
  accessType: "password",
  views: 124,
  lastUpdated: "2 days ago",
  categories: ["Fashion", "Beauty", "Lifestyle"],
  influencers: [
    {
      id: 1,
      name: "Emma Johnson",
      handle: "@emmajohnson",
      platform: "Instagram",
      followers: "1.2M",
      category: "Fashion",
      image: "/placeholder.svg?height=200&width=200&query=young woman fashion influencer",
      engagement: "3.5%",
      pricing: {
        story: "$500",
        post: "$1,200",
        reel: "$2,000",
        video: "$3,500",
      },
    },
    {
      id: 2,
      name: "Sophia Chen",
      handle: "@sophiastyle",
      platform: "Instagram",
      followers: "850K",
      category: "Fashion",
      image: "/placeholder.svg?height=200&width=200&query=asian woman fashion model",
      engagement: "4.2%",
      pricing: {
        story: "$400",
        post: "$950",
        reel: "$1,800",
        video: "$2,800",
      },
    },
    {
      id: 3,
      name: "Marcus Williams",
      handle: "@marcuswears",
      platform: "Instagram",
      followers: "620K",
      category: "Men's Fashion",
      image: "/placeholder.svg?height=200&width=200&query=black man fashion model",
      engagement: "3.8%",
      pricing: {
        story: "$350",
        post: "$800",
        reel: "$1,500",
        video: "$2,200",
      },
    },
    {
      id: 4,
      name: "Olivia Taylor",
      handle: "@oliviastyle",
      platform: "TikTok",
      followers: "1.5M",
      category: "Fashion",
      image: "/placeholder.svg?height=200&width=200&query=young woman tiktok fashion creator",
      engagement: "5.1%",
      pricing: {
        story: "$600",
        post: "$1,400",
        reel: "$2,500",
        video: "$4,000",
      },
    },
    {
      id: 5,
      name: "Alex Rodriguez",
      handle: "@alexfashion",
      platform: "YouTube",
      followers: "980K",
      category: "Fashion",
      image: "/placeholder.svg?height=200&width=200&query=hispanic man fashion youtuber",
      engagement: "4.5%",
      pricing: {
        story: "$450",
        post: "$1,100",
        reel: "$2,200",
        video: "$3,800",
      },
    },
    {
      id: 6,
      name: "Zoe Miller",
      handle: "@zoemillerstyle",
      platform: "Instagram",
      followers: "750K",
      category: "Sustainable Fashion",
      image: "/placeholder.svg?height=200&width=200&query=woman sustainable fashion influencer",
      engagement: "3.9%",
      pricing: {
        story: "$380",
        post: "$900",
        reel: "$1,700",
        video: "$2,600",
      },
    },
  ],
}

export default function SheetViewPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 py-6">
        <div className="container px-4 md:px-6">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <Button asChild variant="ghost" size="sm" className="mr-2">
                <Link href="/dashboard/brand">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Link>
              </Button>
              <h1 className="text-2xl font-bold md:text-3xl">{sheetData.name}</h1>
              {sheetData.accessType === "password" && (
                <Badge variant="outline" className="ml-2 flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  Password Protected
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4" />
                Share
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-muted-foreground">{sheetData.description}</p>
            <div className="mt-2 flex flex-wrap gap-1">
              {sheetData.categories.map((category) => (
                <Badge key={category} variant="secondary">
                  {category}
                </Badge>
              ))}
            </div>
          </div>

          <div className="mb-8 flex items-center justify-between rounded-lg border bg-card p-4 shadow-sm">
            <div className="flex items-center gap-4">
              <img
                src={sheetData.agent.avatar || "/placeholder.svg"}
                alt={sheetData.agent.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <div className="flex items-center">
                  <h3 className="font-medium">{sheetData.agent.name}</h3>
                  {sheetData.agent.verified && (
                    <svg
                      className="ml-1 h-4 w-4 text-blue-500"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">{sheetData.agent.company}</p>
              </div>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div className="flex items-center">
                <Eye className="mr-1 h-4 w-4" />
                {sheetData.views} views
              </div>
              <div>Updated {sheetData.lastUpdated}</div>
            </div>
          </div>

          <Tabs defaultValue="grid" className="space-y-4">
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="grid">Grid View</TabsTrigger>
                <TabsTrigger value="list">List View</TabsTrigger>
              </TabsList>
              <div className="text-sm text-muted-foreground">{sheetData.influencers.length} influencers</div>
            </div>

            <TabsContent value="grid" className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {sheetData.influencers.map((influencer) => (
                  <InfluencerCard key={influencer.id} influencer={influencer} />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="list" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Influencers List</CardTitle>
                  <CardDescription>Detailed list view of all influencers in this sheet</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {sheetData.influencers.map((influencer) => (
                      <div key={influencer.id} className="flex items-center gap-4 border-b pb-4">
                        <img
                          src={influencer.image || "/placeholder.svg"}
                          alt={influencer.name}
                          className="h-16 w-16 rounded-md object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center">
                            <h3 className="font-medium">{influencer.name}</h3>
                            <Badge variant="secondary" className="ml-2">
                              {influencer.platform}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{influencer.handle}</p>
                          <div className="mt-1 flex items-center gap-4 text-sm">
                            <span>{influencer.followers} followers</span>
                            <span>{influencer.engagement} engagement</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-medium">Post: {influencer.pricing.post}</div>
                          <div className="text-sm">Story: {influencer.pricing.story}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}
