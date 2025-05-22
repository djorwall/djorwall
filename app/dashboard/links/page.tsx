"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getLinksAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { LinkCreator } from "@/components/dashboard/link-creator"
import { LinkTable } from "@/components/link-table"

interface LinkData {
  id: string
  originalUrl: string
  shortLink: string
  createdAt: string
  clicks: number
}

export default function LinksPage() {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Links</h1>
        <Button>Create new link</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new link</CardTitle>
          <CardDescription>Paste your long URL to create a shortened link</CardDescription>
        </CardHeader>
        <CardContent>
          <LinkCreator onSuccess={fetchLinks} />
        </CardContent>
      </Card>

      <Tabs defaultValue="all">
        <div className="flex items-center justify-between mb-4">
          <TabsList>
            <TabsTrigger value="all">All links</TabsTrigger>
            <TabsTrigger value="recent">Recent</TabsTrigger>
            <TabsTrigger value="top">Top performing</TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2">
            <Input placeholder="Search links..." className="w-[250px]" />
            <Button variant="outline">Filter</Button>
          </div>
        </div>

        <TabsContent value="all" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : links.length > 0 ? (
                <LinkTable links={links} onDelete={fetchLinks} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">You haven't created any links yet</p>
                  <Button onClick={() => document.querySelector("form")?.scrollIntoView({ behavior: "smooth" })}>
                    Create your first link
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="recent" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : links.length > 0 ? (
                <LinkTable
                  links={[...links]
                    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                    .slice(0, 5)}
                  onDelete={fetchLinks}
                />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No recent links found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="top" className="mt-0">
          <Card>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
                </div>
              ) : links.length > 0 ? (
                <LinkTable links={[...links].sort((a, b) => b.clicks - a.clicks).slice(0, 5)} onDelete={fetchLinks} />
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No top performing links found</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
