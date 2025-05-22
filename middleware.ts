import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the request is for a protected route
  const isProtectedRoute = req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/admin")

  // Check if the request is for an auth route
  const isAuthRoute =
    req.nextUrl.pathname.startsWith("/login") ||
    req.nextUrl.pathname.startsWith("/signup") ||
    req.nextUrl.pathname.startsWith("/forgot-password")

  // If accessing a protected route without being authenticated, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/login"
    redirectUrl.searchParams.set("redirectedFrom", req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If accessing an auth route while authenticated, redirect to dashboard
  if (isAuthRoute && session) {
    const redirectUrl = req.nextUrl.clone()
    redirectUrl.pathname = "/dashboard"
    return NextResponse.redirect(redirectUrl)
  }

  // Check if the request is for an admin route
  if (req.nextUrl.pathname.startsWith("/admin")) {
    // Get the user's role from their profile
    const { data: profile } = await supabase.from("user_profiles").select("role").eq("id", session?.user?.id).single()

    // If the user is not an admin, redirect to dashboard
    if (!profile || (profile.role !== "admin" && profile.role !== "superadmin")) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = "/dashboard"
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup", "/forgot-password"],
}
