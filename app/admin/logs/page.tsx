"use client"

import { useState } from "react"
import { Search, DownloadIcon, RefreshCcw } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const ACTIVITY_LOGS = [
  {
    id: "1",
    action: "User Login",
    user: "john@example.com",
    ip: "192.168.1.1",
    timestamp: "2023-05-24 14:32:15",
    status: "success",
  },
  {
    id: "2",
    action: "Link Created",
    user: "jane@example.com",
    ip: "192.168.1.2",
    timestamp: "2023-05-24 13:15:22",
    status: "success",
  },
  {
    id: "3",
    action: "Failed Login Attempt",
    user: "unknown@example.com",
    ip: "192.168.1.3",
    timestamp: "2023-05-24 12:45:10",
    status: "error",
  },
  {
    id: "4",
    action: "Settings Changed",
    user: "admin@example.com",
    ip: "192.168.1.4",
    timestamp: "2023-05-24 11:30:05",
    status: "success",
  },
  {
    id: "5",
    action: "QR Code Generated",
    user: "robert@example.com",
    ip: "192.168.1.5",
    timestamp: "2023-05-24 10:22:47",
    status: "success",
  },
  {
    id: "6",
    action: "User Logout",
    user: "john@example.com",
    ip: "192.168.1.1",
    timestamp: "2023-05-24 09:15:33",
    status: "success",
  },
  {
    id: "7",
    action: "API Key Generated",
    user: "jane@example.com",
    ip: "192.168.1.2",
    timestamp: "2023-05-23 16:45:12",
    status: "success",
  },
  {
    id: "8",
    action: "User Account Deleted",
    user: "temp@example.com",
    ip: "192.168.1.6",
    timestamp: "2023-05-23 15:10:08",
    status: "warning",
  },
  {
    id: "9",
    action: "Database Backup",
    user: "system",
    ip: "localhost",
    timestamp: "2023-05-23 03:00:00",
    status: "success",
  },
  {
    id: "10",
    action: "System Update",
    user: "system",
    ip: "localhost",
    timestamp: "2023-05-22 02:30:00",
    status: "success",
  },
]

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState(ACTIVITY_LOGS)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.ip.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesStatus = selectedStatus === "all" || log.status === selectedStatus

    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Activity Logs</h1>
        <Button variant="outline">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Export Logs
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Activity</CardTitle>
          <CardDescription>Track all activities performed on the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="warning">Warning</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="ghost" size="icon" title="Refresh">
                <RefreshCcw className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>IP Address</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="font-medium">{log.action}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>{log.ip}</TableCell>
                    <TableCell>{log.timestamp}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          log.status === "success" ? "default" : log.status === "warning" ? "secondary" : "destructive"
                        }
                      >
                        {log.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              Showing <span className="font-medium">{filteredLogs.length}</span> of{" "}
              <span className="font-medium">{logs.length}</span> entries
            </div>
            <div className="space-x-2">
              <Button variant="outline" size="sm" disabled>
                Previous
              </Button>
              <Button variant="outline" size="sm">
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
