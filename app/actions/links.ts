"use server"

import { getSupabaseServiceClient } from "@/lib/supabase/server"
import { generateShortId, isValidUrl, parseUserAgent } from "@/lib/utils/links"
import { revalidatePath } from "next/cache"
import { headers } from "next/headers"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Create a new link
export async function createLink(formData: FormData) {
  const originalUrl = formData.get("url") as string

  if (!originalUrl || !isValidUrl(originalUrl)) {
    return {
      success: false,
      message: "Please enter a valid URL",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()
    const userId = session?.user?.id

    // Generate a unique short ID
    const shortId = generateShortId()

    // Insert the link into the database
    const { data, error } = await supabase
      .from("links")
      .insert({
        short_id: shortId,
        original_url: originalUrl,
        user_id: userId || null,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating link:", error)
      return {
        success: false,
        message: "Failed to create link. Please try again.",
      }
    }

    revalidatePath("/dashboard/links")

    return {
      success: true,
      message: "Link created successfully",
      data: {
        shortId,
        shortUrl: `${process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"}/${shortId}`,
      },
    }
  } catch (error) {
    console.error("Error creating link:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Get links for the current user
export async function getUserLinks() {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    // Get links for the current user
    const { data, error } = await supabase
      .from("links")
      .select(`
        id,
        short_id,
        original_url,
        title,
        is_active,
        created_at,
        updated_at
      `)
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching links:", error)
      return {
        success: false,
        message: "Failed to fetch links. Please try again.",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching links:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Get link by short ID
export async function getLinkByShortId(shortId: string) {
  try {
    const supabase = getSupabaseServiceClient()

    // Get link by short ID
    const { data, error } = await supabase
      .from("links")
      .select(`
        id,
        short_id,
        original_url,
        android_url,
        ios_url,
        fallback_url,
        is_active,
        expiry_date
      `)
      .eq("short_id", shortId)
      .single()

    if (error || !data) {
      console.error("Error fetching link:", error)
      return {
        success: false,
        message: "Link not found or has expired",
      }
    }

    // Check if link is active
    if (!data.is_active) {
      return {
        success: false,
        message: "This link has been deactivated",
      }
    }

    // Check if link has expired
    if (data.expiry_date && new Date(data.expiry_date) < new Date()) {
      return {
        success: false,
        message: "This link has expired",
      }
    }

    return {
      success: true,
      data,
    }
  } catch (error) {
    console.error("Error fetching link:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Record a click
export async function recordClick(linkId: string) {
  try {
    const supabase = getSupabaseServiceClient()
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const referer = headersList.get("referer") || ""
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1"

    // Parse user agent
    const { deviceType, os, browser } = parseUserAgent(userAgent)

    // Record the click
    const { error } = await supabase.from("clicks").insert({
      link_id: linkId,
      ip_address: ip,
      user_agent: userAgent,
      referrer: referer,
      device_type: deviceType,
      browser,
      os,
    })

    if (error) {
      console.error("Error recording click:", error)
    }

    return {
      success: !error,
    }
  } catch (error) {
    console.error("Error recording click:", error)
    return {
      success: false,
    }
  }
}

// Delete a link
export async function deleteLink(linkId: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    // Delete the link
    const { error } = await supabase.from("links").delete().eq("id", linkId).eq("user_id", session.user.id)

    if (error) {
      console.error("Error deleting link:", error)
      return {
        success: false,
        message: "Failed to delete link. Please try again.",
      }
    }

    revalidatePath("/dashboard/links")

    return {
      success: true,
      message: "Link deleted successfully",
    }
  } catch (error) {
    console.error("Error deleting link:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Get link analytics
export async function getLinkAnalytics(linkId: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is authenticated
    const {
      data: { session },
    } = await supabase.auth.getSession()

    if (!session?.user) {
      return {
        success: false,
        message: "User not authenticated",
      }
    }

    // Get link to verify ownership
    const { data: link, error: linkError } = await supabase
      .from("links")
      .select("id")
      .eq("id", linkId)
      .eq("user_id", session.user.id)
      .single()

    if (linkError || !link) {
      return {
        success: false,
        message: "Link not found or you do not have permission to view analytics",
      }
    }

    // Get click analytics
    const { data: clicks, error: clicksError } = await supabase
      .from("clicks")
      .select("*")
      .eq("link_id", linkId)
      .order("created_at", { ascending: false })

    if (clicksError) {
      console.error("Error fetching analytics:", clicksError)
      return {
        success: false,
        message: "Failed to fetch analytics. Please try again.",
      }
    }

    // Get click count by device
    const deviceCounts = clicks.reduce((acc: Record<string, number>, click) => {
      const deviceType = click.device_type || "unknown"
      acc[deviceType] = (acc[deviceType] || 0) + 1
      return acc
    }, {})

    // Get click count by OS
    const osCounts = clicks.reduce((acc: Record<string, number>, click) => {
      const os = click.os || "unknown"
      acc[os] = (acc[os] || 0) + 1
      return acc
    }, {})

    // Get click count by browser
    const browserCounts = clicks.reduce((acc: Record<string, number>, click) => {
      const browser = click.browser || "unknown"
      acc[browser] = (acc[browser] || 0) + 1
      return acc
    }, {})

    // Get click count by country
    const countryCounts = clicks.reduce((acc: Record<string, number>, click) => {
      const country = click.country || "unknown"
      acc[country] = (acc[country] || 0) + 1
      return acc
    }, {})

    return {
      success: true,
      data: {
        totalClicks: clicks.length,
        clicks,
        deviceCounts,
        osCounts,
        browserCounts,
        countryCounts,
      },
    }
  } catch (error) {
    console.error("Error fetching analytics:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}
