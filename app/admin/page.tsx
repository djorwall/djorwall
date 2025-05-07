import { checkAdminAuth } from "./auth-utils"
import { getAgentStats, getBrandStats, getSheetStats, getTopAgents, getPricingStats } from "@/lib/admin-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { UserGrowthChart } from "./components/charts/user-growth-chart"
import { TopAgentsTable } from "./components/charts/top-agents-table"
import { SheetsByAccessTypeChart } from "./components/charts/sheets-by-access-type-chart"
import { PlatformDistributionChart } from "./components/charts/platform-distribution-chart"
import { PricingDistributionChart } from "./components/charts/pricing-distribution-chart"

export default async function AdminDashboard() {
  // Check if user is authenticated and is an admin
  const { user } = await checkAdminAuth()

  // Fetch dashboard data
  const agentStats = await getAgentStats()
  const brandStats = await getBrandStats()
  const sheetStats = await getSheetStats()
  const topAgents = await getTopAgents(5)
  const pricingStats = await getPricingStats()

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p className="text-gray-500">Welcome back, Admin. Here's what's happening with your platform.</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.totalAgents}</div>
            <p className="text-xs text-muted-foreground">{agentStats.newAgents} new in the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verified Agents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{agentStats.verifiedAgents}</div>
            <p className="text-xs text-muted-foreground">{agentStats.verificationRate}% verification rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Brands</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{brandStats.totalBrands}</div>
            <p className="text-xs text-muted-foreground">{brandStats.newBrands} new in the last 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Sheets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{sheetStats.totalSheets}</div>
            <p className="text-xs text-muted-foreground">Across all agents</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>User Growth</CardTitle>
            <CardDescription>New users over the last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <UserGrowthChart />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Top Performing Agents</CardTitle>
            <CardDescription>By number of sheets</CardDescription>
          </CardHeader>
          <CardContent>
            <TopAgentsTable agents={topAgents} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Sheets by Access Type</CardTitle>
            <CardDescription>Distribution of sheet access types</CardDescription>
          </CardHeader>
          <CardContent>
            <SheetsByAccessTypeChart data={sheetStats.accessTypeDistribution} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Brand Industry Distribution</CardTitle>
            <CardDescription>Brands by industry</CardDescription>
          </CardHeader>
          <CardContent>
            <PlatformDistributionChart data={brandStats.industryDistribution} />
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Pricing Types</CardTitle>
            <CardDescription>Distribution of pricing models</CardDescription>
          </CardHeader>
          <CardContent>
            <PricingDistributionChart data={pricingStats.pricingTypeDistribution} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
