"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

interface LinkData {
  id: string
  originalUrl: string
  shortLink: string
  createdAt: string
  clicks: number
}

interface AnalyticsChartsProps {
  links: LinkData[]
  analyticsData?: {
    deviceData: { name: string; value: number }[]
    referrerData: { name: string; value: number }[]
    clicksByDay: { date: string; clicks: number }[]
  } | null
}

export function AnalyticsCharts({ links, analyticsData }: AnalyticsChartsProps) {
  // Prepare data for charts
  const clicksData = links.map((link) => ({
    name: new URL(link.shortLink).pathname.split("/").pop(),
    clicks: link.clicks,
  }))

  // Use real data if available, otherwise use mock data
  const deviceData = analyticsData?.deviceData || [
    { name: "Android", value: 45 },
    { name: "iOS", value: 40 },
    { name: "Desktop", value: 15 },
  ]

  const referrerData = analyticsData?.referrerData || [
    { name: "Direct", value: 60 },
    { name: "Social", value: 25 },
    { name: "Search", value: 10 },
    { name: "Other", value: 5 },
  ]

  // Format dates for the line chart
  const clicksByDay =
    analyticsData?.clicksByDay?.map((item) => ({
      name: new Date(item.date).toLocaleDateString(undefined, { month: "short", day: "numeric" }),
      clicks: item.clicks,
    })) || []

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"]

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Link Performance</CardTitle>
          <CardDescription>Click statistics for your links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={clicksData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="clicks" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {analyticsData?.clicksByDay && analyticsData.clicksByDay.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Clicks Over Time</CardTitle>
            <CardDescription>Daily click trends</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={clicksByDay}
                  margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="clicks" stroke="#3b82f6" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Device Breakdown</CardTitle>
            <CardDescription>Distribution of clicks by device type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
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
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Referrer Sources</CardTitle>
            <CardDescription>Where your link traffic is coming from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={referrerData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {referrerData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
