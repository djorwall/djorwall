"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Clipboard, Check, Trash2 } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { deleteLinkAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface LinkData {
  id: string
  originalUrl: string
  shortLink: string
  createdAt: string
  clicks: number
}

interface LinkTableProps {
  links: LinkData[]
  onDelete?: () => void
}

export function LinkTable({ links, onDelete }: LinkTableProps) {
  const [copiedLinks, setCopiedLinks] = useState<Record<string, boolean>>({})
  const [deletingLinks, setDeletingLinks] = useState<Record<string, boolean>>({})
  const { toast } = useToast()

  const copyToClipboard = (link: string) => {
    navigator.clipboard.writeText(link)
    setCopiedLinks({ ...copiedLinks, [link]: true })
    setTimeout(() => {
      setCopiedLinks({ ...copiedLinks, [link]: false })
    }, 2000)
  }

  const deleteLink = async (id: string) => {
    try {
      setDeletingLinks({ ...deletingLinks, [id]: true })

      const result = await deleteLinkAction(id)

      if (result.success) {
        toast({
          title: "Success",
          description: "Link deleted successfully",
        })

        if (onDelete) {
          onDelete()
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to delete link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error deleting link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setDeletingLinks({ ...deletingLinks, [id]: false })
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString() + " " + date.toLocaleTimeString()
  }

  const truncateUrl = (url: string, maxLength = 40) => {
    return url.length > maxLength ? url.substring(0, maxLength) + "..." : url
  }

  return (
    <div className="overflow-x-auto">
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
              <TableCell className="font-medium">
                <a
                  href={link.originalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                  title={link.originalUrl}
                >
                  {truncateUrl(link.originalUrl)}
                </a>
              </TableCell>
              <TableCell>
                <a
                  href={link.shortLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  {truncateUrl(link.shortLink, 30)}
                </a>
              </TableCell>
              <TableCell>{formatDate(link.createdAt)}</TableCell>
              <TableCell>{link.clicks}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyToClipboard(link.shortLink)}>
                    {copiedLinks[link.shortLink] ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteLink(link.id)}
                    disabled={deletingLinks[link.id]}
                  >
                    {deletingLinks[link.id] ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-red-500 border-t-transparent"></div>
                    ) : (
                      <Trash2 className="h-4 w-4 text-red-500" />
                    )}
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
