import type React from "react"
import AdminSidebar from "./components/admin-sidebar"
import { checkAdminAuth } from "./auth-utils"

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check admin authentication
  await checkAdminAuth()

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-auto">{children}</div>
    </div>
  )
}
