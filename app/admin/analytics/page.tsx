import { createServerClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { checkAdminAuth } from "../auth-utils"
import { getUserGrowthData, getTopAgents } from "@/lib/admin-service"
import { UserGrowthChart } from "../components/charts/user-growth-chart"
import { TopAgentsTable } from "../components/charts/top-agents-table"
import { SheetsByAccessTypeChart } from "../components/charts/sheets-by-access-type-chart"
import { ViewsByMonthChart } from "../components/charts/views-by-month-chart"
import { PlatformDistributionChart } from "../components/charts/platform-distribution-chart"
import { EngagementRateChart } from "../components/charts/engagement-rate-chart"

export default async function AnalyticsPage() {
  // Check admin authentication
  await checkAdminAuth()

  const supabase = createServerClient()

  // Fetch analytics data
  const [
    { data: usersByRole },
    { data: sheetsByAccessType },
    { data: viewsByMonth },
    { data: topSheets },
    userGrowthData,
    topAgentsData,
    { data: platformDistribution },
    { data: engagementRates },
  ] = await Promise.all([
    supabase.rpc("get_users_by_role"),
    supabase.rpc("get_sheets_by_access_type"),
    supabase.rpc("get_views_by_month"),
    supabase.rpc("get_top_viewed_sheets", { limit_num: 5 }),
    getUserGrowthData(),
    getTopAgents(5),
    supabase
      .from("influencers")
      .select("platform")
      .then((res) => {
        // Count by platform
        const platforms: Record<string, number> = {}
        res.data?.forEach((inf) => {
          platforms[inf.platform] = (platforms[inf.platform] || 0) + 1
        })
        return { data: Object.entries(platforms).map(([name, value]) => ({ name, value })) }
      }),
    supabase
      .from("influencers")
      .select("engagement")
      .then((res) => {
        // Group by engagement rate ranges
        const ranges = {
          "0-1%": 0,
          "1-2%": 0,
          "2-3%": 0,
          "3-4%": 0,
          "4-5%": 0,
          "5%+": 0,
        }

        res.data?.forEach((inf) => {
          const rate = Number.parseFloat(inf.engagement.replace("%", ""))
          if (rate < 1) ranges["0-1%"]++
          else if (rate < 2) ranges["1-2%"]++
          else if (rate < 3) ranges["2-3%"]++
          else if (rate < 4) ranges["3-4%"]++
          else if (rate < 5) ranges["4-5%"]++
          else ranges["5%+"]++
        })

        return { data: Object.entries(ranges).map(([name, value]) => ({ name, value })) }
      }),
  ])

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Analytics & Reporting</h1>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="sheets">Sheets</TabsTrigger>
          <TabsTrigger value="influencers">Influencers</TabsTrigger>
          <TabsTrigger value="views">Views</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <StatCard title="Total Users" value={usersByRole?.reduce((sum, item) => sum + item.count, 0) || 0} />
            <StatCard
              title="Total Sheets"
              value={sheetsByAccessType?.reduce((sum, item) => sum + item.count, 0) || 0}
            />
            <StatCard title="Total Views" value={viewsByMonth?.reduce((sum, item) => sum + item.count, 0) || 0} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Users by Role</CardTitle>
              </CardHeader>
              <CardContent>
                <UsersByRoleChart data={usersByRole || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Viewed Sheets</CardTitle>
              </CardHeader>
              <CardContent>
                <TopSheetsTable data={topSheets || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <UserGrowthChart data={userGrowthData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Agents</CardTitle>
              </CardHeader>
              <CardContent>
                <TopAgentsTable data={topAgentsData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="sheets" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Sheets by Access Type</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <SheetsByAccessTypeChart data={sheetsByAccessType || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Sheet Creation Over Time</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                {/* Placeholder for sheet creation chart */}
                <div className="h-full flex items-center justify-center bg-gray-50 rounded-lg">
                  <p className="text-gray-500">Sheet creation chart would be displayed here</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="influencers" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Platform Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <PlatformDistributionChart data={platformDistribution || []} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement Rate Distribution</CardTitle>
              </CardHeader>
              <CardContent className="h-80">
                <EngagementRateChart data={engagementRates || []} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="views" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Views by Month</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ViewsByMonthChart data={viewsByMonth || []} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
}

function UsersByRoleChart({ data }: { data: any[] }) {
  // In a real app, you would use a charting library like recharts
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <div key={item.role} className="flex items-center">
          <div className="w-32 font-medium">{item.role}</div>
          <div className="flex-1">
            <div className="h-4 bg-blue-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 rounded-full"
                style={{
                  width: `${(item.count / data.reduce((sum, i) => sum + i.count, 0)) * 100}%`,
                }}
              />
            </div>
          </div>
          <div className="w-12 text-right font-medium">{item.count}</div>
        </div>
      ))}
    </div>
  )
}

function TopSheetsTable({ data }: { data: any[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Sheet Name</th>
            <th className="text-right py-2 font-medium">Views</th>
          </tr>
        </thead>
        <tbody>
          {data.map((sheet) => (
            <tr key={sheet.id} className="border-b">
              <td className="py-2">{sheet.name}</td>
              <td className="py-2 text-right">{sheet.view_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
