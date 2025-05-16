import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if the user is authenticated
  const isAuthenticated = !!session

  // Get the pathname from the URL
  const { pathname } = req.nextUrl

  // Define protected routes
  const isProtectedRoute = pathname.startsWith("/dashboard") || pathname.startsWith("/admin")
  const isAuthRoute = pathname === "/login" || pathname === "/signup" || pathname === "/forgot-password"
  const isAdminRoute = pathname.startsWith("/admin")

  // If the route is protected and the user is not authenticated, redirect to login
  if (isProtectedRoute && !isAuthenticated) {
    const redirectUrl = new URL("/login", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is authenticated and trying to access auth routes, redirect to dashboard
  if (isAuthenticated && isAuthRoute) {
    const redirectUrl = new URL("/dashboard", req.url)
    return NextResponse.redirect(redirectUrl)
  }

  // If the route is admin and the user is not an admin, redirect to dashboard
  if (isAdminRoute && isAuthenticated) {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    // Get the user's profile to check if they are an admin
    const { data: profile } = await supabase.from("profiles").select("is_admin").eq("id", user?.id).single()

    if (!profile?.is_admin) {
      const redirectUrl = new URL("/dashboard", req.url)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

// Only run the middleware on the following paths
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup", "/forgot-password"],
}
