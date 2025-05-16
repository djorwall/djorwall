"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

interface VerifyResponse {
  success: boolean
  challenge_ts?: string
  hostname?: string
  score?: number
  action?: string
  error_codes?: string[]
}

export async function verifyReCaptcha(token: string) {
  try {
    if (!token) {
      return {
        success: false,
        message: "reCAPTCHA token is required",
      }
    }

    // Get reCAPTCHA settings from the database
    const supabase = createServerActionClient<Database>({ cookies })
    const { data, error } = await supabase.from("settings").select("value").eq("key", "api_recaptcha").single()

    if (error) {
      console.error("Error fetching reCAPTCHA settings:", error)
      return {
        success: false,
        message: "Failed to load reCAPTCHA settings",
      }
    }

    const settings = data.value as {
      siteKey: string
      secretKey: string
    }

    if (!settings || !settings.secretKey) {
      return {
        success: false,
        message: "reCAPTCHA is not properly configured",
      }
    }

    // Verify the token with Google reCAPTCHA
    const verifyUrl = "https://www.google.com/recaptcha/api/siteverify"
    const formData = new URLSearchParams()
    formData.append("secret", settings.secretKey)
    formData.append("response", token)

    const response = await fetch(verifyUrl, {
      method: "POST",
      body: formData,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })

    if (!response.ok) {
      throw new Error(`reCAPTCHA verification request failed: ${response.statusText}`)
    }

    const result: VerifyResponse = await response.json()

    if (!result.success) {
      console.error("reCAPTCHA verification failed:", result.error_codes)
      return {
        success: false,
        message: "reCAPTCHA verification failed. Please try again.",
      }
    }

    // For reCAPTCHA v3, check the score
    if (result.score !== undefined && result.score < 0.5) {
      return {
        success: false,
        message: "Suspicious activity detected. Please try again.",
      }
    }

    return {
      success: true,
      message: "reCAPTCHA verification successful",
    }
  } catch (error) {
    console.error("Error verifying reCAPTCHA:", error)
    return {
      success: false,
      message: "An unexpected error occurred during verification",
    }
  }
}
