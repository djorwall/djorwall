"use server"

import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { checkAdminAuth } from "../auth-utils"
import { revalidatePath } from "next/cache"

type AddUserData = {
  email: string
  password: string
  fullName: string
  role: "admin" | "agent" | "brand"
  companyName?: string
  brandName?: string
}

export async function addUserByAdmin(data: AddUserData) {
  try {
    // Verify the current user is an admin
    await checkAdminAuth()

    const cookieStore = cookies()
    const supabase = createServerClient(cookieStore)

    // Create user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true, // Auto-confirm the email
      user_metadata: {
        full_name: data.fullName,
        role: data.role,
      },
    })

    if (authError) {
      return { success: false, error: authError.message }
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
      return { success: false, error: userError.message }
    }

    // Create profile based on role
    if (data.role === "agent" && data.companyName) {
      const { error: profileError } = await supabase.from("agent_profiles").insert({
        user_id: authData.user.id,
        company_name: data.companyName,
      })

      if (profileError) {
        return { success: false, error: profileError.message }
      }
    } else if (data.role === "brand" && data.brandName) {
      const { error: profileError } = await supabase.from("brand_profiles").insert({
        user_id: authData.user.id,
        brand_name: data.brandName,
      })

      if (profileError) {
        return { success: false, error: profileError.message }
      }
    }

    // Revalidate the users page to show the new user
    revalidatePath("/admin/users")

    return {
      success: true,
      user: {
        id: authData.user.id,
        email: data.email,
        fullName: data.fullName,
        role: data.role,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "An unexpected error occurred",
    }
  }
}
