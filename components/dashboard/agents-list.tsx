import Link from "next/link"
import { CheckCircle2, Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data for agents
const agents = [
  {
    id: 1,
    name: "Sarah Johnson",
    company: "Elite Talent Management",
    avatar: "/professional-woman-short-hair.png",
    verified: true,
    rating: 4.9,
    reviews: 124,
    categories: ["Fashion", "Beauty", "Lifestyle"],
    influencers: 45,
  },
  {
    id: 2,
    name: "Michael Chen",
    company: "Digital Influence Agency",
    avatar: "/asian-businessman.png",
    verified: true,
    rating: 4.8,
    reviews: 98,
    categories: ["Tech", "Gaming", "B2B"],
    influencers: 32,
  },
  {
    id: 3,
    name: "Jessica Williams",
    company: "Creative Talent Co.",
    avatar: "/placeholder.svg?key=4ormt",
    verified: false,
    rating: 4.6,
    reviews: 76,
    categories: ["Food", "Travel", "Photography"],
    influencers: 28,
  },
]

export function AgentsList() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {agents.map((agent) => (
        <Card key={agent.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                    <AvatarFallback>{agent.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center">
                      <h3 className="font-medium">{agent.name}</h3>
                      {agent.verified && <CheckCircle2 className="ml-1 h-4 w-4 text-blue-500" />}
                    </div>
                    <p className="text-sm text-muted-foreground">{agent.company}</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span className="ml-1 text-sm font-medium">{agent.rating}</span>
                  <span className="ml-1 text-xs text-muted-foreground">({agent.reviews})</span>
                </div>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {agent.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">{agent.influencers} influencers in network</p>
              </div>

              <div className="mt-4 flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/agents/${agent.id}`}>View Profile</Link>
                </Button>
                <Button asChild size="sm">
                  <Link href={`/agents/${agent.id}/request`}>Request Access</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
