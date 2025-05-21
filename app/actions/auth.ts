"use server"

import { createActionClient, authConfig } from "@/lib/supabase/auth"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

// Helper function to get a safe redirect URL
function getSafeRedirectUrl(url: string | null | undefined): string {
  if (!url) return "/dashboard"

  try {
    // Check if it's a relative URL (starts with /)
    if (url.startsWith("/")) {
      // List of allowed redirect URLs
      const allowedUrls = [
        "/dashboard",
        "/dashboard/links",
        "/dashboard/analytics",
        "/dashboard/profile",
        "/dashboard/settings",
      ]

      return allowedUrls.some((allowedUrl) => url === allowedUrl || url.startsWith(`${allowedUrl}/`))
        ? url
        : "/dashboard"
    }

    // If it's an absolute URL, check if it's for our domain
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"
    const siteHostname = new URL(siteUrl).hostname
    const urlHostname = new URL(url).hostname

    return siteHostname === urlHostname ? url : "/dashboard"
  } catch (error) {
    console.error("Error validating redirect URL:", error)
    return "/dashboard"
  }
}

// Sign up a new user
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string
  const redirectTo = formData.get("redirectTo") as string | undefined

  // Get safe redirect URL
  const safeRedirectUrl = getSafeRedirectUrl(redirectTo)

  if (!email || !password || !firstName || !lastName) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  try {
    const supabase = createActionClient()

    // Get the site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          redirect_to: safeRedirectUrl, // Store the redirect URL in user metadata
        },
        emailRedirectTo: `${siteUrl}${authConfig.pages.verifyEmail}`,
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
  const redirectTo = formData.get("redirectTo") as string | undefined

  // Get safe redirect URL
  const safeRedirectUrl = getSafeRedirectUrl(redirectTo)

  if (!email || !password) {
    return {
      success: false,
      message: "Please enter your email and password",
    }
  }

  try {
    const supabase = createActionClient()

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
export async function signInWithGoogle(redirectTo = authConfig.defaultRedirectUrl) {
  try {
    const supabase = createActionClient()
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    // Get safe redirect URL
    const safeRedirectUrl = getSafeRedirectUrl(redirectTo)

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
export async function signOut() {
  const supabase = createActionClient()
  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  return redirect("/")
}

// Request password reset
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string
  const redirectTo = formData.get("redirectTo") as string | undefined

  // Get safe redirect URL
  const safeRedirectUrl = getSafeRedirectUrl(redirectTo)

  if (!email) {
    return {
      success: false,
      message: "Please enter your email address",
    }
  }

  try {
    const supabase = createActionClient()

    // Get the site URL from environment variable
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}${authConfig.pages.resetPassword}?redirectTo=${encodeURIComponent(safeRedirectUrl)}`,
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
  const redirectTo = formData.get("redirectTo") as string | undefined

  // Get safe redirect URL
  const safeRedirectUrl = getSafeRedirectUrl(redirectTo)

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
    const supabase = createActionClient()

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
  const supabase = createActionClient()

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

// Check if the current user is authenticated
export async function isAuthenticated() {
  const user = await getCurrentUser()
  return user !== null
}
