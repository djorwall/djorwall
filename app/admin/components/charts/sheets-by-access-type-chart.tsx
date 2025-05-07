"use client"

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

interface SheetsByAccessTypeChartProps {
  data: Array<{
    access_type: string
    count: number
  }>
}

export function SheetsByAccessTypeChart({ data }: SheetsByAccessTypeChartProps) {
  // Format data for the chart
  const formattedData = data.map((item) => ({
    name: item.access_type.charAt(0).toUpperCase() + item.access_type.slice(1),
    value: item.count,
  }))

  // Colors for different access types
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={formattedData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
        >
          {formattedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(value) => [`${value} sheets`, "Count"]} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
