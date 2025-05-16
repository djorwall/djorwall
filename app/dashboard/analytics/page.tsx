import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, LineChart } from "@/components/ui/chart"

export default function AnalyticsPage() {
  // Sample data for charts
  const clicksData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Clicks",
        data: [1200, 1900, 3000, 5000, 4000, 6500],
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgb(0, 123, 255)",
        borderWidth: 2,
      },
    ],
  }

  const devicesData = {
    labels: ["Android", "iOS", "Windows", "Mac", "Linux", "Other"],
    datasets: [
      {
        label: "Devices",
        data: [4500, 3800, 1200, 900, 300, 100],
        backgroundColor: [
          "rgba(40, 167, 69, 0.6)",
          "rgba(0, 123, 255, 0.6)",
          "rgba(108, 99, 255, 0.6)",
          "rgba(255, 193, 7, 0.6)",
          "rgba(220, 53, 69, 0.6)",
          "rgba(108, 117, 125, 0.6)",
        ],
        borderColor: [
          "rgb(40, 167, 69)",
          "rgb(0, 123, 255)",
          "rgb(108, 99, 255)",
          "rgb(255, 193, 7)",
          "rgb(220, 53, 69)",
          "rgb(108, 117, 125)",
        ],
        borderWidth: 1,
      },
    ],
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">10,892</div>
            <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">24</div>
            <p className="text-xs text-muted-foreground mt-1">+2 new links this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">App Opens</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">7,219</div>
            <p className="text-xs text-muted-foreground mt-1">66.3% of total clicks</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Click Trends</CardTitle>
              <CardDescription>Total clicks over the last 6 months</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <LineChart
                  data={clicksData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>Clicks by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <BarChart
                  data={devicesData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="locations">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Clicks by country and region</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Geographic map visualization would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Sources that drive traffic to your links</CardDescription>
            </CardHeader>
            <CardContent className="h-[400px] flex items-center justify-center">
              <p className="text-muted-foreground">Referrer data visualization would be displayed here</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
