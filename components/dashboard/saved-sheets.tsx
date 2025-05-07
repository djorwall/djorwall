import Link from "next/link"
import { Eye } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Sample data for saved sheets
const savedSheets = [
  {
    id: 1,
    name: "Fashion Influencers 2024",
    agent: {
      name: "Sarah Johnson",
      company: "Elite Talent Management",
      avatar: "/placeholder.svg?height=40&width=40&query=S",
    },
    influencers: 24,
    categories: ["Fashion", "Beauty"],
    lastViewed: "2 days ago",
  },
  {
    id: 2,
    name: "Tech Reviewers Network",
    agent: {
      name: "Michael Chen",
      company: "Digital Influence Agency",
      avatar: "/placeholder.svg?height=40&width=40&query=M",
    },
    influencers: 18,
    categories: ["Tech", "Gaming"],
    lastViewed: "1 week ago",
  },
  {
    id: 3,
    name: "Food & Travel Creators",
    agent: {
      name: "Jessica Williams",
      company: "Creative Talent Co.",
      avatar: "/placeholder.svg?height=40&width=40&query=J",
    },
    influencers: 15,
    categories: ["Food", "Travel"],
    lastViewed: "3 days ago",
  },
]

export function SavedSheets() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {savedSheets.map((sheet) => (
        <Card key={sheet.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="p-6">
              <h3 className="font-medium">{sheet.name}</h3>

              <div className="mt-2 flex items-center space-x-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={sheet.agent.avatar || "/placeholder.svg"} alt={sheet.agent.name} />
                  <AvatarFallback>{sheet.agent.name[0]}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{sheet.agent.name}</span>
              </div>

              <div className="mt-4">
                <div className="flex flex-wrap gap-1 mb-2">
                  {sheet.categories.map((category) => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
                <p className="text-sm text-muted-foreground">
                  {sheet.influencers} influencers • Last viewed {sheet.lastViewed}
                </p>
              </div>

              <div className="mt-4 flex justify-between">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/sheets/${sheet.id}`}>
                    <Eye className="mr-1 h-3 w-3" />
                    View Sheet
                  </Link>
                </Button>
                <Button asChild variant="ghost" size="sm">
                  <Link href={`/agents/${sheet.agent.name.toLowerCase().replace(" ", "-")}`}>Agent Profile</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
