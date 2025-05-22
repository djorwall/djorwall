"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

const data = [
  {
    name: "USA",
    value: 12500,
  },
  {
    name: "UK",
    value: 8300,
  },
  {
    name: "Canada",
    value: 6700,
  },
  {
    name: "Germany",
    value: 5400,
  },
  {
    name: "France",
    value: 4200,
  },
  {
    name: "Australia",
    value: 3800,
  },
  {
    name: "Japan",
    value: 3100,
  },
]

export function TopCountries() {
  return (
    <ChartContainer
      config={{
        value: {
          label: "Clicks",
          color: "hsl(var(--primary))",
        },
      }}
      className="h-full w-full"
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="name" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="value" fill="var(--color-value)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}
