"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Download } from "lucide-react"
import { format, subDays } from "date-fns"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"

interface CampaignAnalyticsProps {
  campaignId: string
}

export function CampaignAnalytics({ campaignId }: CampaignAnalyticsProps) {
  const [dateRange, setDateRange] = useState<{
    from: Date
    to: Date
  }>({
    from: subDays(new Date(), 30),
    to: new Date(),
  })
  const [isLoading, setIsLoading] = useState(true)
  const [analyticsData, setAnalyticsData] = useState<any>(null)

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true)

      // In a real app, you would fetch this data from your API
      // For now, we'll generate mock data
      setTimeout(() => {
        // Generate daily data for the selected date range
        const dailyData = generateDailyData(dateRange.from, dateRange.to)

        // Generate other analytics data
        const data = {
          dailyData,
          deviceData: [
            { name: "Desktop", value: 4200 },
            { name: "Mobile", value: 5800 },
            { name: "Tablet", value: 1000 },
          ],
          sourceData: [
            { name: "Direct", value: 2200 },
            { name: "Social", value: 4500 },
            { name: "Email", value: 2300 },
            { name: "Referral", value: 1500 },
            { name: "Organic", value: 500 },
          ],
          conversionData: [
            { name: "Viewed", value: 11000 },
            { name: "Clicked", value: 5500 },
            { name: "Converted", value: 1200 },
          ],
          locationData: [
            { name: "United States", value: 4500 },
            { name: "United Kingdom", value: 1800 },
            { name: "Germany", value: 1200 },
            { name: "France", value: 900 },
            { name: "Canada", value: 800 },
            { name: "Other", value: 1800 },
          ],
          hourlyData: generateHourlyData(),
          linkPerformance: [
            { name: "Homepage", clicks: 3200, conversions: 450 },
            { name: "Product Page", clicks: 2800, conversions: 380 },
            { name: "Blog Post", clicks: 1900, conversions: 210 },
            { name: "Landing Page", clicks: 1600, conversions: 160 },
          ],
          summary: {
            totalClicks: 11000,
            totalConversions: 1200,
            conversionRate: 10.9,
            averageTimeOnPage: "2m 45s",
            bounceRate: 42.5,
          },
        }

        setAnalyticsData(data)
        setIsLoading(false)
      }, 1000)
    }

    fetchAnalytics()
  }, [dateRange, campaignId])

  // Generate mock daily data
  const generateDailyData = (startDate: Date, endDate: Date) => {
    const data = []
    const currentDate = new Date(startDate)

    while (currentDate <= endDate) {
      // Base values with some randomness
      const clicks = Math.floor(Math.random() * 300) + 100
      const conversions = Math.floor(clicks * (Math.random() * 0.2 + 0.05))

      data.push({
        date: format(currentDate, "MMM dd"),
        clicks: clicks,
        conversions: conversions,
        ctr: Number.parseFloat((Math.random() * 5 + 2).toFixed(2)),
      })

      currentDate.setDate(currentDate.getDate() + 1)
    }

    return data
  }

  // Generate mock hourly data
  const generateHourlyData = () => {
    const data = []

    for (let hour = 0; hour < 24; hour++) {
      const hourLabel = `${hour}:00`
      const clicks = Math.floor(Math.random() * 200) + 20

      data.push({
        hour: hourLabel,
        clicks: clicks,
      })
    }

    return data
  }

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

  const handleDownloadReport = () => {
    // In a real app, this would generate and download a report
    alert("This would download a detailed analytics report in a real application.")
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Campaign Analytics</h2>
          <p className="text-gray-500">Detailed performance metrics for your campaign</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[300px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {format(dateRange.from, "PPP")} - {format(dateRange.to, "PPP")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={dateRange.from}
                selected={{
                  from: dateRange.from,
                  to: dateRange.to,
                }}
                onSelect={(range) => {
                  if (range?.from && range?.to) {
                    setDateRange({ from: range.from, to: range.to })
                  }
                }}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>

          <Button variant="outline" onClick={handleDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Total Clicks</div>
            <div className="text-2xl font-bold mt-1">{analyticsData.summary.totalClicks.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Conversions</div>
            <div className="text-2xl font-bold mt-1">{analyticsData.summary.totalConversions.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Conversion Rate</div>
            <div className="text-2xl font-bold mt-1">{analyticsData.summary.conversionRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Avg. Time on Page</div>
            <div className="text-2xl font-bold mt-1">{analyticsData.summary.averageTimeOnPage}</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="text-sm font-medium text-gray-500">Bounce Rate</div>
            <div className="text-2xl font-bold mt-1">{analyticsData.summary.bounceRate}%</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="devices">Devices</TabsTrigger>
          <TabsTrigger value="geography">Geography</TabsTrigger>
          <TabsTrigger value="links">Link Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Daily Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Clicks and conversions over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={analyticsData.dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="clicks"
                      stroke="#0088FE"
                      activeDot={{ r: 8 }}
                      strokeWidth={2}
                    />
                    <Line yAxisId="right" type="monotone" dataKey="conversions" stroke="#00C49F" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle>Conversion Funnel</CardTitle>
              <CardDescription>Visitor journey from view to conversion</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.conversionData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#0088FE" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Hourly Activity */}
          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>Click distribution by hour of day</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={analyticsData.hourlyData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="clicks" stroke="#8884d8" fill="#8884d8" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={analyticsData.sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={120}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {analyticsData.sourceData.map((entry: any, index: number) => (
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
              <CardTitle>Referral Traffic</CardTitle>
              <CardDescription>Top referring websites</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Facebook", value: 2800 },
                      { name: "Twitter", value: 1800 },
                      { name: "Instagram", value: 1600 },
                      { name: "LinkedIn", value: 1200 },
                      { name: "Google", value: 900 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="devices" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Visits by device type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData.deviceData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.deviceData.map((entry: any, index: number) => (
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
                <CardTitle>Browser Distribution</CardTitle>
                <CardDescription>Visits by browser type</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: "Chrome", value: 5500 },
                          { name: "Safari", value: 3200 },
                          { name: "Firefox", value: 1200 },
                          { name: "Edge", value: 800 },
                          { name: "Other", value: 300 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={120}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {analyticsData.deviceData.map((entry: any, index: number) => (
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
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Device Performance</CardTitle>
              <CardDescription>Conversion rates by device type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "Desktop", conversionRate: 12.5, bounceRate: 38.2 },
                      { name: "Mobile", conversionRate: 8.7, bounceRate: 45.8 },
                      { name: "Tablet", conversionRate: 10.2, bounceRate: 41.3 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversionRate" name="Conversion Rate (%)" fill="#0088FE" />
                    <Bar dataKey="bounceRate" name="Bounce Rate (%)" fill="#FF8042" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="geography" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Visits by country</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.locationData}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" width={100} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884D8" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Performance by Region</CardTitle>
              <CardDescription>Conversion rates by top countries</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: "United States", conversionRate: 11.2, clickRate: 4.8 },
                      { name: "United Kingdom", conversionRate: 10.5, clickRate: 4.2 },
                      { name: "Germany", conversionRate: 9.8, clickRate: 3.9 },
                      { name: "France", conversionRate: 8.7, clickRate: 3.5 },
                      { name: "Canada", conversionRate: 12.1, clickRate: 5.1 },
                    ]}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversionRate" name="Conversion Rate (%)" fill="#00C49F" />
                    <Bar dataKey="clickRate" name="Click Rate (%)" fill="#0088FE" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
              <CardDescription>Clicks and conversions by link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analyticsData.linkPerformance} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="clicks" fill="#0088FE" />
                    <Bar dataKey="conversions" fill="#00C49F" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Conversion Rates</CardTitle>
              <CardDescription>Conversion rate by link</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={analyticsData.linkPerformance.map((item: any) => ({
                      name: item.name,
                      conversionRate: ((item.conversions / item.clicks) * 100).toFixed(1),
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="conversionRate" name="Conversion Rate (%)" fill="#FFBB28" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
