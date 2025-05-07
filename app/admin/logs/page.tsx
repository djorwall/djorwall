import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getSystemLogs } from "@/lib/admin-service"
import { checkAdminAuth } from "../auth-utils"
import { SystemLogsTable } from "../components/system-logs-table"

export default async function SystemLogsPage() {
  // Check admin authentication
  await checkAdminAuth()

  // Fetch system logs
  const logs = await getSystemLogs(100)

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">System Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <SystemLogsTable logs={logs} />
        </CardContent>
      </Card>
    </div>
  )
}
