import type React from "react"
import { AdminHeader } from "@/components/admin/header"
import { Sidebar } from "@/components/admin/sidebar"
import { ProtectedRoute } from "@/components/auth/protected-route"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute adminOnly>
      <div className="flex min-h-screen flex-col">
        <AdminHeader />
        <div className="flex flex-1">
          <Sidebar />
          <main className="flex-1 bg-gray-50">{children}</main>
        </div>
      </div>
    </ProtectedRoute>
  )
}
