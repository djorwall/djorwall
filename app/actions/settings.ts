"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Get reCAPTCHA settings for the frontend
export async function getCaptchaSettings() {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Get settings from the database
    const { data, error } = await supabase.from("settings").select("value").eq("key", "api_recaptcha").single()

    if (error) {
      // If settings don't exist yet, return empty defaults
      if (error.code === "PGRST116") {
        return {
          success: true,
          data: {
            siteKey: "",
          },
        }
      }

      console.error("Error fetching reCAPTCHA settings:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    // Only return the site key (public), not the secret key
    const settings = data.value as { siteKey: string; secretKey: string }

    return {
      success: true,
      data: {
        siteKey: settings.siteKey,
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
