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

    const { error } = await supabase.auth.signInWithPassword({
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
