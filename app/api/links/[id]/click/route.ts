import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/auth"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const shortId = params.id

    if (!shortId) {
      return NextResponse.json({ success: false, message: "Short ID is required" }, { status: 400 })
    }

    // Increment the click count
    const supabase = createServiceClient()
    const { error } = await supabase.rpc("increment_link_clicks", {
      short_id_param: shortId,
    })

    if (error) {
      console.error("Error incrementing click count:", error)
      return NextResponse.json({ success: false, message: "Failed to record click" }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error recording click:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
