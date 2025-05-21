"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { formatDistanceToNow } from "date-fns"
import { Copy, ExternalLink, Trash } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface Link {
  id: string
  short_id: string
  original_url: string
  created_at: string
  clicks: number
}

interface LinksTableProps {
  links: Link[]
}

export function LinksTable({ links }: LinksTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const copyToClipboard = (shortId: string) => {
    const url = `${window.location.origin}/${shortId}`
    navigator.clipboard.writeText(url)
    toast({
      title: "Link copied",
      description: "The shortened link has been copied to your clipboard.",
    })
  }

  const deleteLink = async (id: string) => {
    setIsDeleting(id)
    try {
      const response = await fetch(`/api/links/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Link deleted",
          description: "The link has been successfully deleted.",
        })
        // Refresh the page to update the links list
        window.location.reload()
      } else {
        throw new Error("Failed to delete link")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the link. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Original URL</TableHead>
              <TableHead>Short Link</TableHead>
              <TableHead>Created</TableHead>
              <TableHead>Clicks</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium truncate max-w-[200px]">
                  <a
                    href={link.original_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center hover:underline"
                  >
                    {link.original_url}
                    <ExternalLink className="ml-1 h-3 w-3" />
                  </a>
                </TableCell>
                <TableCell>
                  <a href={`/${link.short_id}`} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {`${window.location.origin}/${link.short_id}`}
                  </a>
                </TableCell>
                <TableCell>{formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}</TableCell>
                <TableCell>{link.clicks}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(link.short_id)}>
                      <Copy className="h-4 w-4" />
                      <span className="sr-only">Copy</span>
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting === link.id}
                      onClick={() => deleteLink(link.id)}
                    >
                      <Trash className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
