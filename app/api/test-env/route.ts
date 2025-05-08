import { NextResponse } from "next/server"
import { getSiteUrl } from "@/lib/url-utils"

export async function GET() {
  // Collect all environment variables for testing
  // Only include variables that are safe to expose
  const envData = {
    // URL detection
    detectedUrl: getSiteUrl(),

    // Public environment variables
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || null,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL || null,

    // Server-only environment variables (safe to expose for testing)
    VERCEL_URL: process.env.VERCEL_URL || null,
    VERCEL_ENV: process.env.VERCEL_ENV || null,
    NODE_ENV: process.env.NODE_ENV || null,

    // Deployment information
    isVercel: !!process.env.VERCEL,
    environment: process.env.VERCEL_ENV || process.env.NODE_ENV || "unknown",

    // Timestamp for cache busting
    timestamp: new Date().toISOString(),
  }

  return NextResponse.json(envData)
}
