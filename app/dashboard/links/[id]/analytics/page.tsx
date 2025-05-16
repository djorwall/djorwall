import { getLinkAnalytics, getLinkById } from "@/app/actions/links"
import { LinkAnalyticsDashboard } from "@/components/dashboard/link-analytics-dashboard"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"

export default async function LinkAnalyticsPage({ params }: { params: { id: string } }) {
  const { id } = params

  // Get link details
  const linkResult = await getLinkById(id)
  if (!linkResult.success || !linkResult.data) {
    notFound()
  }

  // Get link analytics
  const analyticsResult = await getLinkAnalytics(id)
  if (!analyticsResult.success) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Link Analytics</h1>
            <p className="text-muted-foreground">
              Analytics for <span className="font-medium text-foreground">{linkResult.data.short_id}</span>
            </p>
          </div>
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/links" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Links</span>
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Error Loading Analytics</CardTitle>
            <CardDescription>
              {analyticsResult.message || "There was an error loading analytics data for this link."}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Please try again later or contact support if this issue persists.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Link Analytics</h1>
          <p className="text-muted-foreground">
            Analytics for <span className="font-medium text-foreground">{linkResult.data.short_id}</span>
          </p>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/dashboard/links" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Links</span>
          </Link>
        </Button>
      </div>

      <LinkAnalyticsDashboard link={linkResult.data} analytics={analyticsResult.data} />
    </div>
  )
}
