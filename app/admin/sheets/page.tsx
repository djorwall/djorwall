import { createServerClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Edit, Trash2, Eye } from "lucide-react"
import { DataTable } from "../components/data-table"

export default async function SheetsPage() {
  const supabase = createServerClient()

  const { data: sheets } = await supabase
    .from("influencer_sheets")
    .select(`
      *,
      users!influencer_sheets_agent_id_fkey(full_name)
    `)
    .order("created_at", { ascending: false })

  const columns = [
    {
      accessorKey: "name",
      header: "Sheet Name",
    },
    {
      accessorKey: "users.full_name",
      header: "Agent",
    },
    {
      accessorKey: "access_type",
      header: "Access Type",
      cell: ({ row }) => {
        const accessType = row.getValue("access_type") as string
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              accessType === "public"
                ? "bg-green-100 text-green-800"
                : accessType === "password"
                  ? "bg-yellow-100 text-yellow-800"
                  : "bg-blue-100 text-blue-800"
            }`}
          >
            {accessType}
          </span>
        )
      },
    },
    {
      accessorKey: "is_published",
      header: "Status",
      cell: ({ row }) => {
        const isPublished = row.getValue("is_published") as boolean
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              isPublished ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
            }`}
          >
            {isPublished ? "Published" : "Draft"}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Created At",
      cell: ({ row }) => {
        return new Date(row.getValue("created_at")).toLocaleDateString()
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sheetId = row.original.id

        return (
          <div className="flex items-center gap-2">
            <Link href={`/sheets/${sheetId}`}>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-1" />
                View
              </Button>
            </Link>
            <Link href={`/admin/sheets/${sheetId}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Link href={`/admin/sheets/${sheetId}/delete`}>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
              </Button>
            </Link>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Influencer Sheets</h1>
        <Link href="/admin/sheets/new">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Create Sheet
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Sheets</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={sheets || []} />
        </CardContent>
      </Card>
    </div>
  )
}
