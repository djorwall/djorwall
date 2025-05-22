"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, BarChart3, Link2, Users, Globe, Smartphone, Laptop, Tablet } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

// Mock data for campaign analytics
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82ca9d"]

interface CustomLink {
  id: string
  name: string
  url: string
  clicks: number
  conversions: number
}

export default function CampaignAnalyticsPage() {
  const params = useParams()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [dateRange, setDateRange] = useState("30d")
  const [campaign, setCampaign] = useState<any>(null)
  const [customLinks, setCustomLinks] = useState<CustomLink[]>([])

  useEffect(() => {
    const fetchCampaignData = async () => {
      try {
        setIsLoading(true)
        // In a real app, you would fetch campaign data from your API
        // For now, we'll use mock data
        setTimeout(() => {
          // Mock campaign data
          const mockCampaign = {
            id: params.id,
            name: "Summer Sale 2024",
            status: "active",
            type: "social",
            startDate: "2024-05-15",
            endDate: "2024-06-15",
            clicks: 1245,
            conversions: 87,
            conversionRate: 6.99,
            links: 5,
            customLinks: [
              { id: "cl-1", name: "Facebook Ad", url: "https://example.com/summer-fb", clicks: 523, conversions: 32 },
              {
                id: "cl-2",
                name: "Instagram Post",
                url: "https://example.com/summer-ig",
                clicks: 412,
                conversions: 28,
              },
              {
                id: "cl-3",
                name: "Email Newsletter",
                url: "https://example.com/summer-email",
                clicks: 310,
                conversions: 27,
              },
            ],
            dailyData: Array.from({ length: 30 }, (_, i) => ({
              date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
              clicks: Math.floor(Math.random() * 100) + 10,
              conversions: Math.floor(Math.random() * 10) + 1,
            })),
            deviceData: [
              { name: "Desktop", value: 45 },
              { name: "Mobile", value: 40 },
              { name: "Tablet", value: 15 },
            ],
            sourceData: [
              { name: "Direct", value: 30 },
              { name: "Social", value: 40 },
              { name: "Email", value: 15 },
              { name: "Referral", value: 10 },
              { name: "Organic", value: 5 },
            ],
            countryData: [
              { name: "United States", value: 40 },
              { name: "United Kingdom", value: 15 },
              { name: "Canada", value: 12 },
              { name: "Australia", value: 8 },
              { name: "Germany", value: 7 },
              { name: "Other", value: 18 },
            ],
            hourlyData: Array.from({ length: 24 }, (_, i) => ({
              hour: i,
              clicks: Math.floor(Math.random() * 50) + 5,
            })),
            linkPerformance: [
              { name: "Facebook Ad", clicks: 523, conversions: 32, conversionRate: 6.1 },
              { name: "Instagram Post", clicks: 412, conversions: 28, conversionRate: 6.8 },
              { name: "Email Newsletter", clicks: 310, conversions: 27, conversionRate: 8.7 },
            ],
          }

          setCampaign(mockCampaign)
          setCustomLinks(mockCampaign.customLinks)
          setIsLoading(false)
        }, 1000)
      } catch (error) {
        console.error("Error fetching campaign data:", error)
        setIsLoading(false)
      }
    }

    fetchCampaignData()
  }, [params.id])

  const handleDateRangeChange = (value: string) => {
    setDateRange(value)
    // In a real app, you would refetch data based on the new date range
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (!campaign) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">Campaign not found</h1>
        <Button onClick={() => router.push("/dashboard/campaigns")}>Back to Campaigns</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push("/dashboard/campaigns")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{campaign.name}</h1>
            <p className="text-gray-500">Campaign Analytics</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={dateRange} onValueChange={handleDateRangeChange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select date range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>
          <Badge
            className={
              campaign.status === "active"
                ? "bg-green-100 text-green-800 hover:bg-green-100"
                : "bg-gray-100 text-gray-800 hover:bg-gray-100"
            }
          >
            {campaign.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
              <BarChart3 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="font-medium">Total Clicks</h3>
            <p className="text-3xl font-bold">{campaign.clicks.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="font-medium">Conversions</h3>
            <p className="text-3xl font-bold">{campaign.conversions.toLocaleString()}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="h-12 w-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
              <Link2 className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="font-medium">Conversion Rate</h3>
            <p className="text-3xl font-bold">{campaign.conversionRate.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="links">Link Performance</TabsTrigger>
          <TabsTrigger value="traffic">Traffic Sources</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Daily Performance</CardTitle>
              <CardDescription>Clicks and conversions over time</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  clicks: {
                    label: "Clicks",
                    color: "hsl(var(--chart-1))",
                  },
                  conversions: {
                    label: "Conversions",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={campaign.dailyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="clicks"
                      stroke="var(--color-clicks)"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                    <Line type="monotone" dataKey="conversions" stroke="var(--color-conversions)" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Traffic Sources</CardTitle>
                <CardDescription>Where your visitors are coming from</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaign.sourceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {campaign.sourceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Devices used by your visitors</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={campaign.deviceData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {campaign.deviceData.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Hourly Activity</CardTitle>
              <CardDescription>Click distribution by hour of day</CardDescription>
            </CardHeader>
            <CardContent className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={campaign.hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="clicks" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Link Performance</CardTitle>
              <CardDescription>Performance metrics for each link in this campaign</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50">
                        <th className="px-4 py-3 text-left font-medium">Link Name</th>
                        <th className="px-4 py-3 text-left font-medium">URL</th>
                        <th className="px-4 py-3 text-left font-medium">Clicks</th>
                        <th className="px-4 py-3 text-left font-medium">Conversions</th>
                        <th className="px-4 py-3 text-left font-medium">Conv. Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customLinks.map((link) => (
                        <tr key={link.id} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 font-medium">{link.name}</td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1">
                              <Link2 className="h-3 w-3 flex-shrink-0" />
                              <span className="truncate max-w-[200px]">{link.url}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3">{link.clicks.toLocaleString()}</td>
                          <td className="px-4 py-3">{link.conversions.toLocaleString()}</td>
                          <td className="px-4 py-3">
                            {link.clicks > 0 ? `${((link.conversions / link.clicks) * 100).toFixed(1)}%` : "0%"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Comparison</CardTitle>
              <CardDescription>Comparative performance of links in this campaign</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={campaign.linkPerformance}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="clicks" fill="#8884d8" name="Clicks" />
                  <Bar yAxisId="right" dataKey="conversions" fill="#82ca9d" name="Conversions" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Link Engagement Over Time</CardTitle>
              <CardDescription>How each link has performed over the campaign period</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer
                config={{
                  facebook: {
                    label: "Facebook Ad",
                    color: "hsl(var(--chart-1))",
                  },
                  instagram: {
                    label: "Instagram Post",
                    color: "hsl(var(--chart-2))",
                  },
                  email: {
                    label: "Email Newsletter",
                    color: "hsl(var(--chart-3))",
                  },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={campaign.dailyData.map((day: any) => ({
                      date: day.date,
                      facebook: Math.floor(day.clicks * 0.42),
                      instagram: Math.floor(day.clicks * 0.33),
                      email: Math.floor(day.clicks * 0.25),
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="facebook"
                      stackId="1"
                      stroke="var(--color-facebook)"
                      fill="var(--color-facebook)"
                    />
                    <Area
                      type="monotone"
                      dataKey="instagram"
                      stackId="1"
                      stroke="var(--color-instagram)"
                      fill="var(--color-instagram)"
                    />
                    <Area
                      type="monotone"
                      dataKey="email"
                      stackId="1"
                      stroke="var(--color-email)"
                      fill="var(--color-email)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="traffic" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaign.sourceData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {campaign.sourceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Device Distribution</CardTitle>
                <CardDescription>Devices used by your visitors</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <div className="flex h-full items-center justify-center">
                  <div className="grid grid-cols-3 gap-8 text-center">
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                        <Smartphone className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="font-medium">Mobile</h3>
                      <p className="text-2xl font-bold">{campaign.deviceData[1].value}%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-green-100 flex items-center justify-center mb-2">
                        <Laptop className="h-8 w-8 text-green-600" />
                      </div>
                      <h3 className="font-medium">Desktop</h3>
                      <p className="text-2xl font-bold">{campaign.deviceData[0].value}%</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="h-16 w-16 rounded-full bg-purple-100 flex items-center justify-center mb-2">
                        <Tablet className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="font-medium">Tablet</h3>
                      <p className="text-2xl font-bold">{campaign.deviceData[2].value}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hourly Activity</CardTitle>
                <CardDescription>Click distribution by hour of day</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={campaign.hourlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hour" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="clicks" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="audience" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Geographic Distribution</CardTitle>
              <CardDescription>Where your visitors are located</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={campaign.countryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {campaign.countryData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Countries</CardTitle>
                <CardDescription>Countries with the most visitors</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {campaign.countryData.slice(0, 5).map((country: any) => (
                    <div key={country.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Globe className="h-5 w-5 text-gray-500" />
                        <span>{country.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="w-32 bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${country.value}%` }}></div>
                        </div>
                        <span className="text-sm font-medium">{country.value}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engagement by Device</CardTitle>
                <CardDescription>Performance metrics across different devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Device</h4>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Clicks</h4>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500">Conv. Rate</h4>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      <span>Mobile</span>
                    </div>
                    <div>{Math.floor(campaign.clicks * 0.4).toLocaleString()}</div>
                    <div>5.8%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center">
                      <Laptop className="h-4 w-4 mr-2" />
                      <span>Desktop</span>
                    </div>
                    <div>{Math.floor(campaign.clicks * 0.45).toLocaleString()}</div>
                    <div>8.2%</div>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="flex items-center justify-center">
                      <Tablet className="h-4 w-4 mr-2" />
                      <span>Tablet</span>
                    </div>
                    <div>{Math.floor(campaign.clicks * 0.15).toLocaleString()}</div>
                    <div>6.5%</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
