import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase = createMiddlewareClient({ req: request, res: response })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // If the user is not signed in and the route is protected, redirect to login
  const isAuthRoute = request.nextUrl.pathname.startsWith("/dashboard") || request.nextUrl.pathname.startsWith("/admin")

  if (isAuthRoute && !session) {
    const redirectUrl = new URL("/login", request.url)
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // If the user is signed in and trying to access auth pages, redirect to dashboard
  const isAuthPage = request.nextUrl.pathname === "/login" || request.nextUrl.pathname === "/signup"

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url))
  }

  return response
}

// Only run middleware on specific routes
export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*", "/login", "/signup", "/logout"],
}
