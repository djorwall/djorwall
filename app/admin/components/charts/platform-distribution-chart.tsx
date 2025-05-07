"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface PlatformDistributionChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

export function PlatformDistributionChart({ data }: PlatformDistributionChartProps) {
  // Colors for different platforms
  const COLORS = {
    Instagram: "#E1306C",
    TikTok: "#000000",
    YouTube: "#FF0000",
    Twitter: "#1DA1F2",
    Other: "#6c757d",
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS] || "#6c757d"} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} influencers`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
