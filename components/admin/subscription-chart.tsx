"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Mock data for the chart
const monthlyData = [
  { month: "Jan", subscribers: 850, revenue: 16575 },
  { month: "Feb", subscribers: 940, revenue: 18330 },
  { month: "Mar", subscribers: 1020, revenue: 19890 },
  { month: "Apr", subscribers: 1080, revenue: 21060 },
  { month: "May", subscribers: 1140, revenue: 22230 },
  { month: "Jun", subscribers: 1190, revenue: 23205 },
  { month: "Jul", subscribers: 1230, revenue: 23985 },
  { month: "Aug", subscribers: 1180, revenue: 23010 },
  { month: "Sep", subscribers: 1220, revenue: 23790 },
  { month: "Oct", subscribers: 1270, revenue: 24765 },
  { month: "Nov", subscribers: 1310, revenue: 25545 },
  { month: "Dec", subscribers: 1248, revenue: 24336 },
]

export function SubscriptionChart() {
  const [chartType, setChartType] = useState("subscribers")
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    // In a real app, you would fetch this data from your API
    setChartData(monthlyData)
  }, [])

  // Find the maximum value for the y-axis
  const maxValue = Math.max(...chartData.map((item) => (chartType === "subscribers" ? item.subscribers : item.revenue)))

  // Calculate the height percentage for each bar
  const calculateHeight = (value: number) => {
    return (value / maxValue) * 100
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Tabs defaultValue="subscribers" className="w-[400px]" onValueChange={setChartType}>
          <TabsList>
            <TabsTrigger value="subscribers">Subscribers</TabsTrigger>
            <TabsTrigger value="revenue">Revenue</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="text-sm text-muted-foreground">Last 12 months</div>
      </div>

      <div className="h-[300px] w-full">
        <div className="flex items-end justify-between h-[250px] w-full">
          {chartData.map((item, index) => (
            <div key={index} className="flex flex-col items-center group">
              <div className="relative">
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {chartType === "subscribers"
                    ? `${item.subscribers} subscribers`
                    : `$${item.revenue.toLocaleString()}`}
                </div>
                <div
                  className="w-12 bg-primary rounded-t transition-all duration-300 hover:opacity-80"
                  style={{
                    height: `${calculateHeight(chartType === "subscribers" ? item.subscribers : item.revenue)}%`,
                    minHeight: "4px",
                  }}
                ></div>
              </div>
              <div className="text-xs mt-2">{item.month}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
