import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated
  const supabase = getSupabaseServerClient()
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    // Add a more descriptive redirect
    return redirect("/login?message=Please sign in to access the dashboard")
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">{children}</main>
    </div>
  )
}
