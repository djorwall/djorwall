"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import { isValidRedirectUrl } from "@/lib/utils/auth"

// Sign up a new user
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard"

  if (!email || !password || !firstName || !lastName) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Get the site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          redirect_to: isValidRedirectUrl(redirectTo) ? redirectTo : "/dashboard", // Store the redirect URL in user metadata
        },
        emailRedirectTo: `${siteUrl}/auth/confirm`,
      },
    })

    if (error) {
      console.error("Error signing up:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    // Create a profile for the new user
    if (data.user) {
      const { error: profileError } = await supabase.from("profiles").insert({
        id: data.user.id,
        full_name: `${firstName} ${lastName}`,
      })

      if (profileError) {
        console.error("Error creating profile:", profileError)
      }
    }

    return {
      success: true,
      message: "Account created successfully. Please check your email for verification.",
    }
  } catch (error) {
    console.error("Error signing up:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Sign in a user
export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard"

  // Validate the redirect URL for security
  const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/dashboard"

  if (!email || !password) {
    return {
      success: false,
      message: "Please enter your email and password",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    const { error, data } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      console.error("Error signing in:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    // Check if email is confirmed
    if (!data.user.email_confirmed_at) {
      return {
        success: false,
        message: "Please confirm your email address before logging in.",
      }
    }

    revalidatePath("/", "layout")

    // Return success with the redirect URL instead of redirecting directly
    // This allows the client to handle the redirect
    return {
      success: true,
      redirectTo: safeRedirectUrl,
    }
  } catch (error) {
    console.error("Error signing in:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Sign in with Google
export async function signInWithGoogle(redirectTo = "/dashboard") {
  try {
    const supabase = createServerActionClient<Database>({ cookies })
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    // Validate the redirect URL for security
    const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/dashboard"

    // Create a state parameter with the redirectTo URL
    const state = encodeURIComponent(JSON.stringify({ redirectTo: safeRedirectUrl }))

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${siteUrl}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
        // Pass the redirectTo URL in the state parameter
        state,
      },
    })

    if (error) {
      console.error("Error signing in with Google:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      url: data.url,
    }
  } catch (error) {
    console.error("Error signing in with Google:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Sign out a user
export async function signOut(redirectTo = "/") {
  const supabase = createServerActionClient<Database>({ cookies })

  await supabase.auth.signOut()
  revalidatePath("/", "layout")

  // Validate the redirect URL for security
  const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/"

  redirect(safeRedirectUrl)
}

// Request password reset
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/dashboard"

  // Validate the redirect URL for security
  const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/dashboard"

  if (!email) {
    return {
      success: false,
      message: "Please enter your email address",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Get the site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/auth/reset-password?redirectTo=${encodeURIComponent(safeRedirectUrl)}`,
    })

    if (error) {
      console.error("Error requesting password reset:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: "Password reset instructions have been sent to your email.",
    }
  } catch (error) {
    console.error("Error requesting password reset:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Reset password
export async function resetPassword(formData: FormData) {
  const password = formData.get("password") as string
  const tokenHash = formData.get("token_hash") as string
  const type = formData.get("type") as string
  const redirectTo = (formData.get("redirectTo") as string) || "/login"

  // Validate the redirect URL for security
  const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/login"

  if (!password) {
    return {
      success: false,
      message: "Please enter a new password",
    }
  }

  if (!tokenHash || type !== "recovery") {
    return {
      success: false,
      message: "Invalid reset token. Please request a new password reset link.",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Verify the token and update the password
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "recovery",
      new_password: password,
    })

    if (error) {
      console.error("Error resetting password:", error)
      return {
        success: false,
        message: error.message,
      }
    }

    return {
      success: true,
      message: "Your password has been reset successfully.",
      redirectTo: safeRedirectUrl,
    }
  } catch (error) {
    console.error("Error resetting password:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Get the current user
export async function getCurrentUser() {
  const supabase = getSupabaseServerClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return null
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

  return {
    ...session.user,
    profile,
  }
}
