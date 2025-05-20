"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Get reCAPTCHA settings for the frontend
export async function getCaptchaSettings() {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const { data, error } = await supabase.from("settings").select("value").eq("key", "api_recaptcha").single()

    if (error) {
      console.error("Error fetching reCAPTCHA settings:", error)
      return {
        success: false,
        message: "Failed to load reCAPTCHA settings",
      }
    }

    // Extract only the site key for frontend use
    const settings = data.value as {
      siteKey: string
      secretKey: string
      version?: "v2" | "v3" | "invisible"
    }

    return {
      success: true,
      data: {
        siteKey: settings.siteKey,
        version: settings.version || "v2", // Default to v2 if not specified
      },
    }
  } catch (error) {
    console.error("Error in getCaptchaSettings:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
