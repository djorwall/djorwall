import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface LinkData {
  originalUrl: string
  shortLink: string
  createdAt: string
  clicks: number
}

interface TopLinksProps {
  links: LinkData[]
}

export function TopLinks({ links }: TopLinksProps) {
  // Sort links by clicks in descending order
  const sortedLinks = [...links].sort((a, b) => b.clicks - a.clicks)

  // Get top 5 links
  const topLinks = sortedLinks.slice(0, 5)

  const truncateUrl = (url: string, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Performing Links</CardTitle>
        <CardDescription>Your most clicked links</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topLinks.length > 0 ? (
            topLinks.map((link, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1 min-w-0">
                  <a
                    href={link.shortLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline font-medium block truncate"
                  >
                    {truncateUrl(link.shortLink, 30)}
                  </a>
                  <p className="text-sm text-gray-500 truncate" title={link.originalUrl}>
                    {truncateUrl(link.originalUrl)}
                  </p>
                </div>
                <Badge variant="secondary" className="ml-2">
                  {link.clicks} {link.clicks === 1 ? "click" : "clicks"}
                </Badge>
              </div>
            ))
          ) : (
            <div className="text-center py-4">
              <p className="text-gray-500">No link data available yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
