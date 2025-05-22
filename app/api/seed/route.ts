import { createServerSupabaseClient } from "@/lib/supabase"
import { NextResponse } from "next/server"
import { nanoid } from "nanoid"

export async function GET() {
  try {
    const supabase = createServerSupabaseClient()

    // Sample URLs to create
    const sampleUrls = [
      "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      "https://www.instagram.com/vercel",
      "https://twitter.com/vercel",
      "https://www.facebook.com/vercel",
      "https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT",
    ]

    // Insert sample links
    const links = []
    for (const url of sampleUrls) {
      const slug = nanoid(6)
      const { data, error } = await supabase
        .from("links")
        .insert({
          original_url: url,
          slug,
          meta: { clicks: Math.floor(Math.random() * 100) },
        })
        .select("id")
        .single()

      if (error) {
        console.error("Error inserting link:", error)
        continue
      }

      links.push({ id: data.id, slug })
    }

    // Insert sample analytics data
    const devices = ["android", "ios", "other"]
    const referrers = [
      "https://www.google.com",
      "https://www.facebook.com",
      "https://twitter.com",
      "https://www.instagram.com",
      "",
    ]

    for (const link of links) {
      // Generate random number of clicks (1-20) for each link
      const clickCount = Math.floor(Math.random() * 20) + 1

      for (let i = 0; i < clickCount; i++) {
        const timestamp = new Date()
        timestamp.setDate(timestamp.getDate() - Math.floor(Math.random() * 30)) // Random date in the last 30 days

        const { error } = await supabase.from("analytics").insert({
          link_id: link.id,
          timestamp: timestamp.toISOString(),
          ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
          user_agent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          referrer: referrers[Math.floor(Math.random() * referrers.length)],
          device: devices[Math.floor(Math.random() * devices.length)],
          country: "United States",
          city: "New York",
        })

        if (error) {
          console.error("Error inserting analytics:", error)
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: "Sample data seeded successfully",
      linksCreated: links.length,
    })
  } catch (error) {
    console.error("Error seeding data:", error)
    return NextResponse.json(
      {
        success: false,
        error: String(error),
      },
      { status: 500 },
    )
  }
}
