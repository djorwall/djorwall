import { Instagram, Star, TwitterIcon as TikTok, Youtube } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface InfluencerCardProps {
  influencer: {
    id: number
    name: string
    handle: string
    platform: string
    followers: string
    category: string
    image: string
    engagement: string
    pricing: {
      story: string
      post: string
      reel: string
      video: string
    }
  }
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={influencer.image || "/placeholder.svg"}
          alt={influencer.name}
          className="h-full w-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">{influencer.name}</h3>
              <p className="text-sm text-gray-300">{influencer.handle}</p>
            </div>
            <div className="flex items-center">
              {influencer.platform === "Instagram" && <Instagram className="h-5 w-5" />}
              {influencer.platform === "TikTok" && <TikTok className="h-5 w-5" />}
              {influencer.platform === "YouTube" && <Youtube className="h-5 w-5" />}
            </div>
          </div>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="secondary">{influencer.category}</Badge>
          <div className="flex items-center text-sm">
            <Star className="mr-1 h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span>{influencer.engagement} engagement</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">{influencer.followers} followers</span>
          <span className="text-muted-foreground">Updated 5 days ago</span>
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
          <div className="flex justify-between">
            <span>Story:</span>
            <span className="font-medium">{influencer.pricing.story}</span>
          </div>
          <div className="flex justify-between">
            <span>Post:</span>
            <span className="font-medium">{influencer.pricing.post}</span>
          </div>
          <div className="flex justify-between">
            <span>Reel:</span>
            <span className="font-medium">{influencer.pricing.reel}</span>
          </div>
          <div className="flex justify-between">
            <span>Video:</span>
            <span className="font-medium">{influencer.pricing.video}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
