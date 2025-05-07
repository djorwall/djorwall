"use client"

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"

interface EngagementRateChartProps {
  data: Array<{
    name: string
    value: number
  }>
}

export function EngagementRateChart({ data }: EngagementRateChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
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
        <Tooltip formatter={(value) => [`${value} influencers`, "Count"]} />
        <Bar dataKey="value" name="Influencers" fill="#10b981" />
      </BarChart>
    </ResponsiveContainer>
  )
}
