"use client"
import { UserManagement } from "@/components/admin/user-management"

const USERS = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    status: "active",
    role: "user",
    plan: "free",
    createdAt: "2023-04-15",
    lastLogin: "2023-05-22",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    status: "active",
    role: "admin",
    plan: "pro",
    createdAt: "2023-03-12",
    lastLogin: "2023-05-24",
  },
  {
    id: "3",
    name: "Robert Johnson",
    email: "robert@example.com",
    status: "suspended",
    role: "user",
    plan: "business",
    createdAt: "2023-01-05",
    lastLogin: "2023-04-18",
  },
  {
    id: "4",
    name: "Emily Wilson",
    email: "emily@example.com",
    status: "active",
    role: "user",
    plan: "pro",
    createdAt: "2023-02-28",
    lastLogin: "2023-05-23",
  },
  {
    id: "5",
    name: "Michael Brown",
    email: "michael@example.com",
    status: "inactive",
    role: "user",
    plan: "free",
    createdAt: "2023-05-10",
    lastLogin: "2023-05-15",
  },
]

export default function UsersPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
      </div>
      <UserManagement />
    </div>
  )
}
