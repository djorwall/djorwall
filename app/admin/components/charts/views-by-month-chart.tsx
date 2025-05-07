"use client"

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface ViewsByMonthChartProps {
  data: Array<{
    month: string
    count: number
  }>
}

export function ViewsByMonthChart({ data }: ViewsByMonthChartProps) {
  // Format month labels to be more readable
  const formattedData = data.map((item) => ({
    ...item,
    month: new Date(item.month + "-01").toLocaleDateString("en-US", { month: "short", year: "numeric" }),
  }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
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
        <Line type="monotone" dataKey="count" name="Views" stroke="#3b82f6" activeDot={{ r: 8 }} strokeWidth={2} />
      </LineChart>
    </ResponsiveContainer>
  )
}
