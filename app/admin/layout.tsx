import type React from "react"
import { AdminSidebar } from "@/components/admin/sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Flag to enable/disable authentication (set to false for public testing)
const ENABLE_AUTH = false

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated and is an admin (only if auth is enabled)
  if (ENABLE_AUTH) {
    const supabase = getSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      return redirect("/login?message=Please sign in to access the admin area")
    }

    // Check if the user is an admin
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", session.user.id).single()

    if (!profile?.is_admin) {
      return redirect("/dashboard?message=You do not have permission to access the admin area")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <AdminSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
