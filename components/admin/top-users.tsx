"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

const topUsers = [
  {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    links: 245,
    percentage: 100,
  },
  {
    id: "2",
    name: "Sarah Williams",
    email: "sarah@example.com",
    links: 189,
    percentage: 77,
  },
  {
    id: "3",
    name: "Michael Brown",
    email: "michael@example.com",
    links: 156,
    percentage: 64,
  },
  {
    id: "4",
    name: "Emily Davis",
    email: "emily@example.com",
    links: 132,
    percentage: 54,
  },
  {
    id: "5",
    name: "David Wilson",
    email: "david@example.com",
    links: 98,
    percentage: 40,
  },
]

export function TopUsers() {
  return (
    <div className="space-y-4">
      {topUsers.map((user) => (
        <div key={user.id} className="flex items-center gap-4">
          <Avatar className="h-9 w-9">
            <AvatarImage src={`/abstract-geometric-shapes.png?height=36&width=36&query=${user.name}`} alt={user.name} />
            <AvatarFallback>
              {user.name.charAt(0)}
              {user.name.split(" ")[1]?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-sm text-muted-foreground">{user.links} links</p>
            </div>
            <Progress value={user.percentage} className="h-2" />
          </div>
        </div>
      ))}
    </div>
  )
}
