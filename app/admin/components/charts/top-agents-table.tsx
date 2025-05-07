"use client"

import Link from "next/link"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface TopAgentsTableProps {
  data: Array<{
    id: string
    name: string
    email: string
    company: string | null
    count: number
  }>
}

export function TopAgentsTable({ data }: TopAgentsTableProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="text-left py-2 font-medium">Agent</th>
            <th className="text-left py-2 font-medium">Company</th>
            <th className="text-right py-2 font-medium">Sheets</th>
          </tr>
        </thead>
        <tbody>
          {data.map((agent) => (
            <tr key={agent.id} className="border-b">
              <td className="py-2">
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(agent.name)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <Link href={`/admin/users/${agent.id}`} className="font-medium hover:underline">
                      {agent.name}
                    </Link>
                    <div className="text-xs text-gray-500">{agent.email}</div>
                  </div>
                </div>
              </td>
              <td className="py-2">{agent.company || "-"}</td>
              <td className="py-2 text-right font-medium">{agent.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
