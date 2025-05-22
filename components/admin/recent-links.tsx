"use client"

import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, ExternalLink } from "lucide-react"

const recentLinks = [
  {
    id: "1",
    originalUrl: "https://example.com/very-long-url-that-needs-to-be-shortened",
    shortLink: "app.op/abc123",
    clicks: 1245,
    createdAt: "2023-05-15",
  },
  {
    id: "2",
    originalUrl: "https://anotherexample.com/product/detail/12345",
    shortLink: "app.op/def456",
    clicks: 873,
    createdAt: "2023-05-14",
  },
  {
    id: "3",
    originalUrl: "https://blog.example.org/how-to-create-short-links",
    shortLink: "app.op/ghi789",
    clicks: 542,
    createdAt: "2023-05-13",
  },
  {
    id: "4",
    originalUrl: "https://docs.example.net/getting-started",
    shortLink: "app.op/jkl012",
    clicks: 321,
    createdAt: "2023-05-12",
  },
  {
    id: "5",
    originalUrl: "https://store.example.com/special-offer",
    shortLink: "app.op/mno345",
    clicks: 198,
    createdAt: "2023-05-11",
  },
]

export function RecentLinks() {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Original URL</TableHead>
          <TableHead>Short Link</TableHead>
          <TableHead>Clicks</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentLinks.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="max-w-[200px] truncate">{link.originalUrl}</TableCell>
            <TableCell>{link.shortLink}</TableCell>
            <TableCell>{link.clicks.toLocaleString()}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon">
                  <Eye className="h-4 w-4" />
                  <span className="sr-only">View details</span>
                </Button>
                <Button variant="ghost" size="icon">
                  <ExternalLink className="h-4 w-4" />
                  <span className="sr-only">Open link</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
