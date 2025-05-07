"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface UserGrowthChartProps {
  data: Array<{
    month: string
    count: number
  }>
}

export function UserGrowthChart({ data }: UserGrowthChartProps) {
  // Format month labels to be more readable
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month).toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={formattedData}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 60,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" name="New Users" fill="#3b82f6" />
      </BarChart>
    </ResponsiveContainer>
  )
}
