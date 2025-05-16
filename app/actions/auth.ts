"use server"

import { getSupabaseServerClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Sign up a new user
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const firstName = formData.get("first-name") as string
  const lastName = formData.get("last-name") as string

  if (!email || !password || !firstName || !lastName) {
    return {
      success: false,
      message: "Please fill in all required fields",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    // Create a new user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/confirm`,
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
    redirect("/dashboard")
  } catch (error) {
    console.error("Error signing in:", error)
    return {
      success: false,
      message: "An unexpected error occurred. Please try again.",
    }
  }
}

// Sign out a user
export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })

  await supabase.auth.signOut()
  revalidatePath("/", "layout")
  redirect("/")
}

// Request password reset
export async function requestPasswordReset(formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return {
      success: false,
      message: "Please enter your email address",
    }
  }

  try {
    const supabase = createServerActionClient<Database>({ cookies })

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
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
