"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/utils/links"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line,
} from "recharts"
import { DatePickerWithRange } from "@/components/date-range-picker"
import { addDays } from "date-fns"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface LinkAnalyticsDashboardProps {
  link: {
    id: string
    short_id: string
    original_url: string
    title: string | null
    created_at: string
  }
  analytics: {
    totalClicks: number
    clicks: any[]
    deviceCounts: Record<string, number>
    osCounts: Record<string, number>
    browserCounts: Record<string, number>
    countryCounts: Record<string, number>
  }
}

// Chart colors
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#A4DE6C", "#D0ED57", "#FFC658"]

export function LinkAnalyticsDashboard({ link, analytics }: LinkAnalyticsDashboardProps) {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -30),
    to: new Date(),
  })

  // Filter clicks by date range
  const filteredClicks =
    dateRange?.from && dateRange?.to
      ? analytics.clicks.filter((click) => {
          const clickDate = new Date(click.created_at)
          return clickDate >= dateRange.from! && clickDate <= dateRange.to!
        })
      : analytics.clicks

  // Prepare data for charts
  const prepareDeviceData = () => {
    return Object.entries(analytics.deviceCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const prepareOsData = () => {
    return Object.entries(analytics.osCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const prepareBrowserData = () => {
    return Object.entries(analytics.browserCounts).map(([name, value]) => ({
      name,
      value,
    }))
  }

  const prepareCountryData = () => {
    return Object.entries(analytics.countryCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name: name === "unknown" ? "Unknown" : name,
        value,
      }))
  }

  // Prepare daily clicks data
  const prepareDailyClicksData = () => {
    if (!dateRange?.from || !dateRange?.to) return []

    const dailyClicks: Record<string, number> = {}
    const currentDate = new Date(dateRange.from)
    const endDate = new Date(dateRange.to)

    // Initialize all dates in range with 0 clicks
    while (currentDate <= endDate) {
      const dateStr = currentDate.toISOString().split("T")[0]
      dailyClicks[dateStr] = 0
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Count clicks for each date
    filteredClicks.forEach((click) => {
      const dateStr = new Date(click.created_at).toISOString().split("T")[0]
      if (dailyClicks[dateStr] !== undefined) {
        dailyClicks[dateStr]++
      }
    })

    // Convert to array for chart
    return Object.entries(dailyClicks).map(([date, count]) => ({
      date,
      clicks: count,
    }))
  }

  // Prepare hourly distribution data
  const prepareHourlyData = () => {
    const hourlyClicks = Array(24).fill(0)

    filteredClicks.forEach((click) => {
      const hour = new Date(click.created_at).getHours()
      hourlyClicks[hour]++
    })

    return hourlyClicks.map((count, hour) => ({
      hour: `${hour}:00`,
      clicks: count,
    }))
  }

  // Prepare referrer data
  const prepareReferrerData = () => {
    const referrers: Record<string, number> = {}

    filteredClicks.forEach((click) => {
      const referrer = click.referrer || "Direct/Unknown"
      referrers[referrer] = (referrers[referrer] || 0) + 1
    })

    return Object.entries(referrers)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, value]) => ({
        name: name === "Direct/Unknown" ? "Direct/Unknown" : new URL(name).hostname,
        value,
      }))
  }

  const deviceData = prepareDeviceData()
  const osData = prepareOsData()
  const browserData = prepareBrowserData()
  const countryData = prepareCountryData()
  const dailyClicksData = prepareDailyClicksData()
  const hourlyData = prepareHourlyData()
  const referrerData = prepareReferrerData()

  // Handle export data
  const handleExportData = () => {
    // Create CSV content
    const headers = [
      "Date",
      "Time",
      "IP Address",
      "Device Type",
      "Browser",
      "OS",
      "Country",
      "Region",
      "City",
      "Referrer",
    ]

    const csvContent = [
      headers.join(","),
      ...filteredClicks.map((click) => {
        const date = new Date(click.created_at)
        const dateStr = date.toLocaleDateString()
        const timeStr = date.toLocaleTimeString()

        return [
          dateStr,
          timeStr,
          click.ip_address || "Unknown",
          click.device_type || "Unknown",
          click.browser || "Unknown",
          click.os || "Unknown",
          click.country || "Unknown",
          click.region || "Unknown",
          click.city || "Unknown",
          click.referrer || "Direct/Unknown",
        ].join(",")
      }),
    ].join("\n")

    // Create and download the file
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", `analytics_${link.short_id}_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{analytics.totalClicks}</div>
            <p className="text-xs text-muted-foreground mt-1">{filteredClicks.length} clicks in selected date range</p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Created</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">{formatDate(link.created_at)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Original URL: <span className="truncate block">{link.original_url}</span>
            </p>
          </CardContent>
        </Card>

        <Card className="flex-1">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Short Link</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-medium">
              {process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"}/{link.short_id}
            </div>
            <p className="text-xs text-muted-foreground mt-1">{link.title || "No title provided"}</p>
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <DatePickerWithRange date={dateRange} setDate={setDateRange} />
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh Data
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportData}>
            <Download className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="timing">Timing</TabsTrigger>
          <TabsTrigger value="referrers">Referrers</TabsTrigger>
          <TabsTrigger value="raw">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Click Trends</CardTitle>
              <CardDescription>Daily clicks over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyClicksData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#0088FE" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Clicks by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
                <CardDescription>Clicks by OS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={osData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {osData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
                <CardDescription>Clicks by browser</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={browserData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {browserData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Types</CardTitle>
                <CardDescription>Clicks by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Operating Systems</CardTitle>
                <CardDescription>Clicks by OS</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={osData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#0088FE" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Browsers</CardTitle>
                <CardDescription>Clicks by browser</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={browserData} layout="vertical" margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#00C49F" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Details</CardTitle>
                <CardDescription>Detailed breakdown of device information</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead className="text-right">Clicks</TableHead>
                      <TableHead className="text-right">Percentage</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {deviceData.map((item) => (
                      <TableRow key={`device-${item.name}`}>
                        <TableCell>Device</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.value}</TableCell>
                        <TableCell className="text-right">
                          {((item.value / analytics.totalClicks) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {osData.map((item) => (
                      <TableRow key={`os-${item.name}`}>
                        <TableCell>OS</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.value}</TableCell>
                        <TableCell className="text-right">
                          {((item.value / analytics.totalClicks) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                    {browserData.map((item) => (
                      <TableRow key={`browser-${item.name}`}>
                        <TableCell>Browser</TableCell>
                        <TableCell>{item.name}</TableCell>
                        <TableCell className="text-right">{item.value}</TableCell>
                        <TableCell className="text-right">
                          {((item.value / analytics.totalClicks) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
              <CardDescription>Clicks by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={countryData} margin={{ top: 5, right: 30, left: 50, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#8884D8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Detailed breakdown by location</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Country</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClicks
                    .reduce(
                      (acc, click) => {
                        const key = `${click.country || "Unknown"}-${click.region || "Unknown"}-${
                          click.city || "Unknown"
                        }`
                        if (!acc[key]) {
                          acc[key] = {
                            country: click.country || "Unknown",
                            region: click.region || "Unknown",
                            city: click.city || "Unknown",
                            count: 0,
                          }
                        }
                        acc[key].count++
                        return acc
                      },
                      {} as Record<string, { country: string; region: string; city: string; count: number }>,
                    )
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 20)
                    .map((location) => (
                      <TableRow key={`${location.country}-${location.region}-${location.city}`}>
                        <TableCell>{location.country}</TableCell>
                        <TableCell>{location.region}</TableCell>
                        <TableCell>{location.city}</TableCell>
                        <TableCell className="text-right">{location.count}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="timing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Click Trends</CardTitle>
              <CardDescription>Clicks per day over the selected time period</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dailyClicksData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="clicks" stroke="#0088FE" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Distribution</CardTitle>
              <CardDescription>Clicks by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={hourlyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrers" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Referrers</CardTitle>
              <CardDescription>Sources that drive traffic to your link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={referrerData} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip />
                    <Bar dataKey="value" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Referrer Details</CardTitle>
              <CardDescription>Detailed breakdown of traffic sources</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Referrer</TableHead>
                    <TableHead className="text-right">Clicks</TableHead>
                    <TableHead className="text-right">Percentage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredClicks
                    .reduce(
                      (acc, click) => {
                        const referrer = click.referrer || "Direct/Unknown"
                        if (!acc[referrer]) {
                          acc[referrer] = 0
                        }
                        acc[referrer]++
                        return acc
                      },
                      {} as Record<string, number>,
                    )
                    .sort((a, b) => b - a)
                    .slice(0, 20)
                    .map((count, referrer) => (
                      <TableRow key={referrer}>
                        <TableCell className="font-medium">
                          {referrer === "Direct/Unknown" ? "Direct/Unknown" : referrer}
                        </TableCell>
                        <TableCell className="text-right">{count}</TableCell>
                        <TableCell className="text-right">
                          {((count / filteredClicks.length) * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Raw Click Data</CardTitle>
              <CardDescription>Individual click records for this link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date & Time</TableHead>
                      <TableHead>Device</TableHead>
                      <TableHead>Browser</TableHead>
                      <TableHead>OS</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Referrer</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredClicks.slice(0, 100).map((click, index) => (
                      <TableRow key={index}>
                        <TableCell>{new Date(click.created_at).toLocaleString()}</TableCell>
                        <TableCell>{click.device_type || "Unknown"}</TableCell>
                        <TableCell>{click.browser || "Unknown"}</TableCell>
                        <TableCell>{click.os || "Unknown"}</TableCell>
                        <TableCell>
                          {click.country ? `${click.country}${click.city ? `, ${click.city}` : ""}` : "Unknown"}
                        </TableCell>
                        <TableCell className="max-w-[200px] truncate">{click.referrer || "Direct/Unknown"}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
              {filteredClicks.length > 100 && (
                <p className="text-center text-sm text-muted-foreground mt-4">
                  Showing 100 of {filteredClicks.length} clicks. Export to CSV to see all data.
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
