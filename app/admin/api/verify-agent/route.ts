import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { type NextRequest, NextResponse } from "next/server"
import { checkAdminAuth } from "../../auth-utils"

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated and is an admin
    await checkAdminAuth()

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Get agent ID from query params
    const { searchParams } = new URL(request.url)
    const agentId = searchParams.get("id")

    if (!agentId) {
      return NextResponse.json({ error: "Agent ID is required" }, { status: 400 })
    }

    // Update agent verification status
    const { error } = await supabase
      .from("agent_profiles")
      .update({
        is_verified: true,
        verification_date: new Date().toISOString(),
      })
      .eq("id", agentId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.redirect(new URL("/admin/verifications", request.url))
  } catch (error) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
