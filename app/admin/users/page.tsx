import { createServerClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle, Edit, Trash2 } from "lucide-react"
import { DataTable } from "../components/data-table"

export default async function UsersPage() {
  const supabase = createServerClient()

  const { data: users } = await supabase.from("users").select("*").order("created_at", { ascending: false })

  const columns = [
    {
      accessorKey: "full_name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              role === "admin"
                ? "bg-purple-100 text-purple-800"
                : role === "agent"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
            }`}
          >
            {role}
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
        const userId = row.original.id

        return (
          <div className="flex items-center gap-2">
            <Link href={`/admin/users/${userId}`}>
              <Button variant="outline" size="sm">
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </Link>
            <Link href={`/admin/users/${userId}/delete`}>
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
        <h1 className="text-3xl font-bold">Users Management</h1>
        <Link href="/admin/users/add">
          <Button>
            <PlusCircle className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Users</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable columns={columns} data={users || []} />
        </CardContent>
      </Card>
    </div>
  )
}
