import {
  createServerComponentClient,
  createServerActionClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs"
import { createClient as createSupabaseClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/lib/supabase/database.types"

// Auth configuration
export const authConfig = {
  // Default redirect URL after login
  defaultRedirectUrl: "/dashboard",

  // Pages configuration
  pages: {
    signIn: "/login",
    signUp: "/signup",
    forgotPassword: "/forgot-password",
    resetPassword: "/auth/reset-password",
    verifyEmail: "/auth/confirm",
  },

  // Allowed redirect URLs (for security)
  allowedRedirectUrls: [
    "/dashboard",
    "/dashboard/links",
    "/dashboard/analytics",
    "/dashboard/profile",
    "/dashboard/settings",
  ],
}

// Client-side Supabase client (for components)
export function createClientComponent() {
  return createClientComponentClient<Database>()
}

// Server-side Supabase client (for server components)
export function createServerComponent() {
  return createServerComponentClient<Database>({ cookies })
}

// Server-side Supabase client (for server actions)
export function createActionClient() {
  return createServerActionClient<Database>({ cookies })
}

// Service role client (for admin operations)
export function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL as string
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string

  return createSupabaseClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  })
}

// Helper to check if a user is authenticated
export async function checkUserAuthenticated() {
  const supabase = createServerComponent()
  const { data } = await supabase.auth.getSession()
  return !!data.session?.user
}

// Helper to get current user
export async function getCurrentUser() {
  const supabase = createServerComponent()
  const { data } = await supabase.auth.getSession()
  return data.session?.user || null
}

// Helper function to get a safe redirect URL
export function getSafeRedirectUrl(url: string | null | undefined): string {
  if (!url) return "/dashboard"

  try {
    // Check if it's a relative URL (starts with /)
    if (url.startsWith("/")) {
      // List of allowed redirect URLs
      const allowedUrls = ["/dashboard", "/"]

      return allowedUrls.some((allowedUrl) => url === allowedUrl || url.startsWith(`${allowedUrl}/`))
        ? url
        : "/dashboard"
    }

    // If it's an absolute URL, check if it's for our domain
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const siteHostname = new URL(siteUrl).hostname
    const urlHostname = new URL(url).hostname

    return siteHostname === urlHostname ? url : "/dashboard"
  } catch (error) {
    console.error("Error validating redirect URL:", error)
    return "/dashboard"
  }
}
