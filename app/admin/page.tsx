import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DashboardMetricCards } from "@/components/admin/dashboard-metric-cards"
import { RecentLinks } from "@/components/admin/recent-links"
import { TopUsers } from "@/components/admin/top-users"
import { TopCountries } from "@/components/admin/top-countries"
import { DeviceStats } from "@/components/admin/device-stats"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Admin Dashboard</h2>
      </div>
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <DashboardMetricCards />

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Recent Links</CardTitle>
                <CardDescription>Recently created links across all users</CardDescription>
              </CardHeader>
              <CardContent>
                <RecentLinks />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Top Users</CardTitle>
                <CardDescription>Users with the most link creations</CardDescription>
              </CardHeader>
              <CardContent>
                <TopUsers />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Countries with the most link clicks</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <TopCountries />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Device Statistics</CardTitle>
                <CardDescription>Link clicks by device type</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <DeviceStats />
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        <TabsContent value="analytics" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Detailed analytics and reporting</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Analytics content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="reports" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Reports</CardTitle>
              <CardDescription>Generate and view reports</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Reports content will be displayed here.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
