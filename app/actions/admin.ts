"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { revalidatePath } from "next/cache"
import type { Database } from "@/lib/supabase/database.types"

// Existing admin actions...

// Get API settings
export async function getApiSettings(type: string) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    // Get user profile to check admin status
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile || !profile.is_admin) {
      return {
        success: false,
        message: "Not authorized",
      }
    }

    // Get settings from the database
    const { data, error } = await supabase.from("settings").select("value").eq("key", `api_${type}`).single()

    if (error) {
      // If settings don't exist yet, return empty defaults
      if (error.code === "PGRST116") {
        if (type === "recaptcha") {
          return {
            success: true,
            data: {
              siteKey: "",
              secretKey: "",
            },
          }
        }
        return {
          success: true,
          data: {},
        }
      }

      console.error("Error fetching API settings:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      data: data.value,
    }
  } catch (error) {
    console.error("Error in getApiSettings:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}

// Update API settings
export async function updateApiSettings(type: string, data: any) {
  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Check if user is admin
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return {
        success: false,
        message: "Not authenticated",
      }
    }

    // Get user profile to check admin status
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user.id).single()

    if (!profile || !profile.is_admin) {
      return {
        success: false,
        message: "Not authorized",
      }
    }

    // Check if settings already exist
    const { data: existingSettings } = await supabase.from("settings").select("id").eq("key", `api_${type}`).single()

    let result

    if (existingSettings) {
      // Update existing settings
      result = await supabase
        .from("settings")
        .update({
          value: data,
          updated_at: new Date().toISOString(),
        })
        .eq("key", `api_${type}`)
    } else {
      // Insert new settings
      result = await supabase.from("settings").insert({
        key: `api_${type}`,
        value: data,
        description: `API settings for ${type}`,
      })
    }

    if (result.error) {
      console.error("Error updating API settings:", result.error)
      return {
        success: false,
        message: result.error.message,
      }
    }

    // Revalidate paths that might use these settings
    revalidatePath("/admin/api")
    revalidatePath("/")

    return {
      success: true,
      message: "Settings updated successfully",
    }
  } catch (error) {
    console.error("Error in updateApiSettings:", error)
    return {
      success: false,
      message: "An unexpected error occurred",
    }
  }
}
