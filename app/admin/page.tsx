import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LineChart } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export default function AdminDashboardPage() {
  // Sample data for charts
  const clicksData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Clicks",
        data: [5200, 7900, 13000, 19000, 24000, 36500],
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        borderColor: "rgb(0, 123, 255)",
        borderWidth: 2,
      },
    ],
  }

  // Sample top users
  const topUsers = [
    { id: "1", name: "John Doe", email: "john@example.com", links: 45, clicks: 12450 },
    { id: "2", name: "Jane Smith", email: "jane@example.com", links: 32, clicks: 8720 },
    { id: "3", name: "Robert Johnson", email: "robert@example.com", links: 28, clicks: 6540 },
    { id: "4", name: "Emily Davis", email: "emily@example.com", links: 21, clicks: 4980 },
  ]

  // Sample top links
  const topLinks = [
    { id: "1", url: "appopener.io/abc123", originalUrl: "example.com/app", clicks: 4250 },
    { id: "2", url: "appopener.io/def456", originalUrl: "anotherapp.com/download", clicks: 3180 },
    { id: "3", url: "appopener.io/ghi789", originalUrl: "playstore.google.com/app/12345", clicks: 2740 },
    { id: "4", url: "appopener.io/jkl012", originalUrl: "apps.apple.com/app/id12345", clicks: 1920 },
  ]

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1">+24 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Links</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">8,742</div>
            <p className="text-xs text-muted-foreground mt-1">+156 this week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">105,892</div>
            <p className="text-xs text-muted-foreground mt-1">+12.3% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Ad Impressions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">84,713</div>
            <p className="text-xs text-muted-foreground mt-1">80% of total clicks</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Traffic Overview</CardTitle>
            <CardDescription>Total platform traffic over the last 6 months</CardDescription>
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Top Users</CardTitle>
            <CardDescription>Users with the most links and clicks</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Links</TableHead>
                  <TableHead>Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.links}</TableCell>
                    <TableCell>{user.clicks.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Links</CardTitle>
            <CardDescription>Most clicked links on the platform</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead className="hidden md:table-cell">Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell className="font-medium">{link.url}</TableCell>
                    <TableCell className="hidden md:table-cell max-w-[200px] truncate">{link.originalUrl}</TableCell>
                    <TableCell>{link.clicks.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
