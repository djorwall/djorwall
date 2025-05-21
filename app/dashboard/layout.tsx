import type React from "react"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

// Flag to enable/disable authentication (set to false for public testing)
const ENABLE_AUTH = false

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Check if user is authenticated (only if auth is enabled)
  if (ENABLE_AUTH) {
    const supabase = getSupabaseServerClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session) {
      // Add a more descriptive redirect
      return redirect("/login?message=Please sign in to access the dashboard")
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      <DashboardSidebar />
      <main className="flex-1 p-6 overflow-auto">
        {!ENABLE_AUTH && (
          <div className="mb-4 p-2 bg-yellow-100 text-yellow-800 rounded-md text-sm">
            Testing Mode: Authentication is disabled. This page would normally require login.
          </div>
        )}
        {children}
      </main>
    </div>
  )
}
