"use client"

import { useState } from "react"
import Link from "next/link"
import { Eye, Lock, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { format, formatDistanceToNow } from "date-fns"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface InfluencerSheetsListProps {
  sheets: any[]
  isLoading: boolean
  onRefresh: () => void
}

export function InfluencerSheetsList({ sheets, isLoading, onRefresh }: InfluencerSheetsListProps) {
  const [searchTerm, setSearchTerm] = useState("")

  const filteredSheets = sheets.filter((sheet) => sheet.name.toLowerCase().includes(searchTerm.toLowerCase()))

  const getLastUpdatedText = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true })
    } catch (error) {
      return "Unknown"
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="h-10 w-28" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet Name</TableHead>
                <TableHead className="hidden md:table-cell">Influencers</TableHead>
                <TableHead className="hidden md:table-cell">Views</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 3 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-5 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-10" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-10" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-5 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-5 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded-full ml-auto" />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <input
          type="text"
          placeholder="Search sheets..."
          className="w-full max-w-sm rounded-md border border-input px-3 py-2 text-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button asChild>
          <Link href="/dashboard/agent/sheets/new">Create New Sheet</Link>
        </Button>
      </div>

      {filteredSheets.length === 0 ? (
        <div className="rounded-md border p-8 text-center">
          <h3 className="text-lg font-medium">No sheets found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "Try a different search term" : "Create your first influencer sheet to get started"}
          </p>
          {!searchTerm && (
            <Button asChild className="mt-4">
              <Link href="/dashboard/agent/sheets/new">Create New Sheet</Link>
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sheet Name</TableHead>
                <TableHead className="hidden md:table-cell">Categories</TableHead>
                <TableHead className="hidden md:table-cell">Created</TableHead>
                <TableHead className="hidden md:table-cell">Last Updated</TableHead>
                <TableHead>Access</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredSheets.map((sheet) => (
                <TableRow key={sheet.id}>
                  <TableCell className="font-medium">{sheet.name}</TableCell>
                  <TableCell className="hidden md:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {sheet.categories &&
                        sheet.categories.slice(0, 2).map((category: string) => (
                          <Badge key={category} variant="secondary" className="text-xs">
                            {category}
                          </Badge>
                        ))}
                      {sheet.categories && sheet.categories.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{sheet.categories.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    {format(new Date(sheet.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{getLastUpdatedText(sheet.updated_at)}</TableCell>
                  <TableCell>
                    {sheet.access_type === "password" && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        Password
                      </Badge>
                    )}
                    {sheet.access_type === "request" && (
                      <Badge variant="outline" className="bg-orange-50 text-orange-500 border-orange-200">
                        Request
                      </Badge>
                    )}
                    {sheet.access_type === "public" && (
                      <Badge variant="outline" className="bg-green-50 text-green-500 border-green-200">
                        Public
                      </Badge>
                    )}
                    {sheet.access_type === "one-time" && (
                      <Badge variant="outline" className="bg-purple-50 text-purple-500 border-purple-200">
                        One-time
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href={`/sheets/${sheet.id}`} className="flex w-full cursor-pointer">
                            <Eye className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link
                            href={`/dashboard/agent/sheets/${sheet.id}/edit`}
                            className="flex w-full cursor-pointer"
                          >
                            <Pencil className="mr-2 h-4 w-4" />
                            <span>Edit</span>
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600 cursor-pointer">
                          <Trash2 className="mr-2 h-4 w-4" />
                          <span>Delete</span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
