import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Create a Supabase client for the middleware
  const supabase = createServerSupabaseClient()

  // Check if the user is authenticated
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Public routes that don't require authentication
  const publicRoutes = ["/", "/login", "/signup", "/forgot-password", "/reset-password"]

  // Check if the route is public
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))

  // If the route is not public and the user is not authenticated, redirect to login
  if (!isPublicRoute && !session) {
    return NextResponse.redirect(new URL(`/login?callbackUrl=${encodeURIComponent(pathname)}`, request.url))
  }

  // If the user is authenticated and trying to access login/signup, redirect to dashboard
  if (session && (pathname === "/login" || pathname === "/signup")) {
    // Get the user's role from the database
    const { data: userData, error } = await supabase.from("users").select("role").eq("id", session.user.id).single()

    if (!error && userData) {
      return NextResponse.redirect(new URL(`/dashboard/${userData.role}`, request.url))
    }

    // Default to agent dashboard if role can't be determined
    return NextResponse.redirect(new URL("/dashboard/agent", request.url))
  }

  return NextResponse.next()
}

// Only run middleware on these paths
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
}
