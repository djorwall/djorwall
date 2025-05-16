import { getUserLinks } from "@/app/actions/links"
import { DashboardLinksTable } from "@/components/dashboard/links-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

export default async function LinksPage() {
  const { success, data: links = [], message } = await getUserLinks()

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">My Links</h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Manage Your Links</CardTitle>
          <CardDescription>View and manage all your smart links</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Input placeholder="Search links..." className="max-w-sm" />
            <Button variant="outline">Search</Button>
          </div>

          <DashboardLinksTable links={links} />
        </CardContent>
      </Card>
    </div>
  )
}
