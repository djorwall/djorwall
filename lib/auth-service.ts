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
  const supabase = getSupabaseBrowser()

  // Get the current site URL dynamically
  const siteUrl = getSiteUrl()

  // Create the user in auth with proper redirect URL
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: data.email,
    password: data.password,
    options: {
      emailRedirectTo: `${siteUrl}/auth/callback`,
      data: {
        full_name: data.fullName,
        role: data.role,
      },
    },
  })

  if (authError || !authData.user) {
    return { user: null, error: authError }
  }

  // Insert the user into our users table
  const { error: userError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: data.email,
    password: "", // We don't store the actual password, just a placeholder
    full_name: data.fullName,
    role: data.role,
  })

  if (userError) {
    return { user: null, error: userError }
  }

  // Create profile based on role
  if (data.role === "agent" && data.companyName) {
    const { error: profileError } = await supabase.from("agent_profiles").insert({
      user_id: authData.user.id,
      company_name: data.companyName,
    })

    if (profileError) {
      return { user: null, error: profileError }
    }
  } else if (data.role === "brand" && data.brandName) {
    const { error: profileError } = await supabase.from("brand_profiles").insert({
      user_id: authData.user.id,
      brand_name: data.brandName,
    })

    if (profileError) {
      return { user: null, error: profileError }
    }
  }

  return { user: authData.user, error: null }
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
