import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  // Just pass through all requests for now
  return NextResponse.next()
}

// Only run the middleware on specific paths (empty for now)
export const config = {
  matcher: [],
}
