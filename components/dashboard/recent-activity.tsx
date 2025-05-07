import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

// Sample data for recent activity
const recentActivity = [
  {
    id: 1,
    type: "view",
    user: {
      name: "Nike Marketing",
      avatar: "/placeholder.svg?height=40&width=40&query=N",
      email: "marketing@nike.com",
    },
    sheet: "Fashion Influencers",
    time: "2 hours ago",
    ip: "192.168.1.45",
  },
  {
    id: 2,
    type: "request",
    user: {
      name: "Apple Brand",
      avatar: "/placeholder.svg?height=40&width=40&query=A",
      email: "partnerships@apple.com",
    },
    sheet: "Tech Reviewers",
    time: "5 hours ago",
    ip: "192.168.2.32",
  },
  {
    id: 3,
    type: "view",
    user: {
      name: "Adidas Team",
      avatar: "/placeholder.svg?height=40&width=40&query=A",
      email: "team@adidas.com",
    },
    sheet: "Fitness Experts",
    time: "Yesterday",
    ip: "192.168.3.21",
  },
  {
    id: 4,
    type: "request",
    user: {
      name: "Samsung Marketing",
      avatar: "/placeholder.svg?height=40&width=40&query=S",
      email: "marketing@samsung.com",
    },
    sheet: "Tech Reviewers",
    time: "Yesterday",
    ip: "192.168.4.76",
  },
  {
    id: 5,
    type: "view",
    user: {
      name: "Puma Brand",
      avatar: "/placeholder.svg?height=40&width=40&query=P",
      email: "brand@puma.com",
    },
    sheet: "Fashion Influencers",
    time: "2 days ago",
    ip: "192.168.5.89",
  },
]

export function RecentActivity() {
  return (
    <div className="space-y-4">
      {recentActivity.map((activity) => (
        <div key={activity.id} className="flex items-center gap-4">
          <Avatar>
            <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
            <AvatarFallback>{activity.user.name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              <span className="font-bold">{activity.user.name}</span>{" "}
              {activity.type === "view" ? "viewed" : "requested access to"} your{" "}
              <span className="font-medium">{activity.sheet}</span> sheet
            </p>
            <p className="text-xs text-muted-foreground">
              {activity.time} • IP: {activity.ip}
            </p>
          </div>
          <div className="rounded-full px-2 py-1 text-xs font-medium">
            {activity.type === "view" ? (
              <span className="text-blue-500 bg-blue-50 px-2 py-1 rounded-full">View</span>
            ) : (
              <span className="text-orange-500 bg-orange-50 px-2 py-1 rounded-full">Request</span>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
