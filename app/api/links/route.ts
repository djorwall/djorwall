import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/auth"
import { nanoid } from "nanoid"
import { getCurrentUser } from "@/lib/supabase/auth"

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json({ success: false, message: "URL is required" }, { status: 400 })
    }

    // Validate URL
    try {
      new URL(url)
    } catch (err) {
      return NextResponse.json({ success: false, message: "Invalid URL" }, { status: 400 })
    }

    // Generate a short ID
    const shortId = nanoid(6)

    // Get current user (if authenticated)
    const user = await getCurrentUser()

    // Create the link in the database
    const supabase = createServiceClient()
    const { data, error } = await supabase
      .from("links")
      .insert({
        original_url: url,
        short_id: shortId,
        user_id: user?.id || null, // Associate with user if authenticated
        clicks: 0,
      })
      .select()

    if (error) {
      console.error("Error creating link:", error)
      return NextResponse.json({ success: false, message: "Failed to create link" }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      shortId,
      url: data[0].original_url,
    })
  } catch (error) {
    console.error("Error creating link:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
