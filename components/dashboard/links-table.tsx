"use client"

import { deleteLink } from "@/app/actions/links"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/components/ui/use-toast"
import { formatDate } from "@/lib/utils/links"
import { BarChart2, Copy, ExternalLink, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import NextLink from "next/link"
import { useState } from "react"

interface DashboardLink {
  id: string
  short_id: string
  original_url: string
  title: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

interface DashboardLinksTableProps {
  links: DashboardLink[]
}

export function DashboardLinksTable({ links }: DashboardLinksTableProps) {
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"}/${shortUrl}`)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      setIsDeleting(id)

      try {
        const result = await deleteLink(id)

        if (result.success) {
          toast({
            title: "Success",
            description: "Link deleted successfully",
          })
        } else {
          toast({
            title: "Error",
            description: result.message || "Failed to delete link. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        console.error("Error deleting link:", error)
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
      } finally {
        setIsDeleting(null)
      }
    }
  }

  if (links.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">You haven't created any links yet.</p>
        <Button asChild className="mt-4">
          <NextLink href="/dashboard">Create your first link</NextLink>
        </Button>
      </div>
    )
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Short Link</TableHead>
            <TableHead className="hidden md:table-cell">Original URL</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="hidden md:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">
                {`${process.env.NEXT_PUBLIC_APP_URL || "appopener.io"}/${link.short_id}`}
              </TableCell>
              <TableCell className="hidden md:table-cell max-w-xs truncate">{link.original_url}</TableCell>
              <TableCell>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${link.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {link.is_active ? "Active" : "Inactive"}
                </span>
              </TableCell>
              <TableCell className="hidden md:table-cell">{formatDate(link.created_at)}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" title="Copy" onClick={() => handleCopy(link.short_id)}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="Open" asChild>
                    <a href={`/${link.short_id}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </Button>
                  <Button variant="ghost" size="icon" title="Analytics" asChild>
                    <NextLink href={`/dashboard/links/${link.id}/analytics`}>
                      <BarChart2 className="h-4 w-4" />
                    </NextLink>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <NextLink href={`/dashboard/links/${link.id}`} className="flex items-center gap-2">
                          <Pencil className="h-4 w-4" />
                          <span>Edit</span>
                        </NextLink>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="flex items-center gap-2 text-destructive"
                        onClick={() => handleDelete(link.id)}
                        disabled={isDeleting === link.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>{isDeleting === link.id ? "Deleting..." : "Delete"}</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
