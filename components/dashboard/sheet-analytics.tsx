"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"

// Sample data for the chart
const data = [
  { name: "Fashion Influencers", views: 124, uniqueViewers: 45 },
  { name: "Tech Reviewers", views: 85, uniqueViewers: 32 },
  { name: "Food Bloggers", views: 67, uniqueViewers: 28 },
  { name: "Travel Creators", views: 92, uniqueViewers: 38 },
  { name: "Fitness Experts", views: 43, uniqueViewers: 21 },
  { name: "Beauty Gurus", views: 27, uniqueViewers: 15 },
]

export function SheetAnalytics() {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => (value.length > 10 ? `${value.substring(0, 10)}...` : value)}
        />
        <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value}`} />
        <Tooltip />
        <Bar dataKey="views" fill="#adfa1d" radius={[4, 4, 0, 0]} />
        <Bar dataKey="uniqueViewers" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  )
}
