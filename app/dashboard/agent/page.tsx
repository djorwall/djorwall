"use client"

import { useEffect, useState } from "react"
import { PlusCircle } from "lucide-react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AgentDashboardHeader } from "@/components/dashboard/agent-dashboard-header"
import { InfluencerSheetsList } from "@/components/dashboard/influencer-sheets-list"
import { SheetAnalytics } from "@/components/dashboard/sheet-analytics"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { useAuth } from "@/contexts/auth-context"
import { getSheetsByAgent } from "@/lib/sheet-service"

export default function AgentDashboardPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()
  const [sheets, setSheets] = useState([])
  const [isLoadingSheets, setIsLoadingSheets] = useState(true)

  useEffect(() => {
    // If not logged in or not an agent, redirect to login
    if (!isLoading && (!user || profile?.role !== "agent")) {
      router.push("/login?role=agent")
      return
    }

    const fetchSheets = async () => {
      if (!user) return

      try {
        const { sheets, error } = await getSheetsByAgent(user.id)

        if (error) {
          console.error("Error fetching sheets:", error)
          return
        }

        setSheets(sheets)
      } catch (error) {
        console.error("Fetch sheets error:", error)
      } finally {
        setIsLoadingSheets(false)
      }
    }

    if (user) {
      fetchSheets()
    }
  }, [user, profile, isLoading, router])

  if (isLoading) {
    return <div className="flex min-h-screen items-center justify-center">Loading...</div>
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AgentDashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <Button onClick={() => router.push("/dashboard/agent/sheets/new")}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Sheet
          </Button>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="sheets">Sheets</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Sheets</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{sheets.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {sheets.length > 0
                      ? `Last updated ${new Date(sheets[0].updated_at).toLocaleDateString()}`
                      : "No sheets yet"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Unique Viewers</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Access Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-</div>
                  <p className="text-xs text-muted-foreground">Coming soon</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Sheet Analytics</CardTitle>
                  <CardDescription>View and engagement metrics for your sheets</CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <SheetAnalytics />
                </CardContent>
              </Card>
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Recent views and access requests</CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentActivity />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="sheets" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Influencer Sheets</CardTitle>
                <CardDescription>Manage and monitor all your influencer sheets</CardDescription>
              </CardHeader>
              <CardContent>
                <InfluencerSheetsList
                  sheets={sheets}
                  isLoading={isLoadingSheets}
                  onRefresh={() => {
                    setIsLoadingSheets(true)
                    getSheetsByAgent(user!.id).then(({ sheets }) => {
                      setSheets(sheets)
                      setIsLoadingSheets(false)
                    })
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
                <CardDescription>Detailed analytics for all your sheets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Detailed analytics charts will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>Manage your public agent profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[400px] flex items-center justify-center border rounded-md">
                  <p className="text-muted-foreground">Profile editor will appear here</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
