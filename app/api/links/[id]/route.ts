import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/auth"
import { getCurrentUser } from "@/lib/supabase/auth"

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const linkId = params.id

    if (!linkId) {
      return NextResponse.json({ success: false, message: "Link ID is required" }, { status: 400 })
    }

    // Get current user
    const user = await getCurrentUser()

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    // Delete the link
    const supabase = createServiceClient()

    // First check if the link belongs to the user
    const { data: link } = await supabase.from("links").select("user_id").eq("id", linkId).single()

    if (!link) {
      return NextResponse.json({ success: false, message: "Link not found" }, { status: 404 })
    }

    if (link.user_id !== user.id) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 403 })
    }

    // Delete the link
    const { error } = await supabase.from("links").delete().eq("id", linkId)

    if (error) {
      console.error("Error deleting link:", error)
      return NextResponse.json({ success: false, message: "Failed to delete link" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting link:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
