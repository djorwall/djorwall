import { getSupabaseBrowser } from "./supabase"
import type { User } from "@supabase/supabase-js"
import { getSiteUrl } from "./url-utils"

export type SignUpData = {
  email: string
  password: string
  fullName: string
  role: "agent" | "brand"
  companyName?: string
  brandName?: string
}

export type LoginData = {
  email: string
  password: string
}

export type UserProfile = {
  id: string
  email: string
  fullName: string
  role: "agent" | "brand"
  companyName?: string
  brandName?: string
}

export const signUp = async (data: SignUpData): Promise<{ user: User | null; error: any }> => {
  try {
    // Use the server-side API route instead of direct Supabase client
    const response = await fetch("/api/auth/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })

    const result = await response.json()

    if (!response.ok) {
      return { user: null, error: result.error }
    }

    // After successful signup, sign in the user
    if (result.user) {
      const supabase = getSupabaseBrowser()
      await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
    }

    return { user: result.user, error: null }
  } catch (error: any) {
    return { user: null, error: error.message }
  }
}

export const login = async (data: LoginData): Promise<{ user: User | null; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: authData, error } = await supabase.auth.signInWithPassword({
    email: data.email,
    password: data.password,
  })

  if (error || !authData.user) {
    return { user: null, error }
  }

  return { user: authData.user, error: null }
}

export const logout = async (): Promise<{ error: any }> => {
  const supabase = getSupabaseBrowser()
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async (): Promise<{ user: User | null; error: any }> => {
  const supabase = getSupabaseBrowser()
  const { data, error } = await supabase.auth.getUser()

  if (error || !data?.user) {
    return { user: null, error }
  }

  return { user: data.user, error: null }
}

export const getUserProfile = async (userId: string): Promise<{ profile: UserProfile | null; error: any }> => {
  const supabase = getSupabaseBrowser()

  // Get the user from our users table
  const { data: userData, error: userError } = await supabase.from("users").select("*").eq("id", userId).single()

  if (userError || !userData) {
    return { profile: null, error: userError }
  }

  const profile: UserProfile = {
    id: userData.id,
    email: userData.email,
    fullName: userData.full_name,
    role: userData.role as "agent" | "brand",
  }

  // Get additional profile data based on role
  if (userData.role === "agent") {
    const { data: agentData, error: agentError } = await supabase
      .from("agent_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (!agentError && agentData) {
      profile.companyName = agentData.company_name
    }
  } else if (userData.role === "brand") {
    const { data: brandData, error: brandError } = await supabase
      .from("brand_profiles")
      .select("*")
      .eq("user_id", userId)
      .single()

    if (!brandError && brandData) {
      profile.brandName = brandData.brand_name
    }
  }

  return { profile, error: null }
}

// Password reset functions
export const sendPasswordResetEmail = async (email: string): Promise<{ error: any }> => {
  const supabase = getSupabaseBrowser()

  // Get the current site URL dynamically
  const siteUrl = getSiteUrl()

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl}/reset-password`,
  })

  return { error }
}

export const resetPassword = async (password: string): Promise<{ error: any }> => {
  const supabase = getSupabaseBrowser()

  const { error } = await supabase.auth.updateUser({ password })

  return { error }
}
