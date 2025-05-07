/**
 * Utility to get the base URL of the application in any environment
 * Works in browser, server components, API routes, and edge functions
 */
export function getSiteUrl(): string {
  // Client-side detection (most accurate when available)
  if (typeof window !== "undefined") {
    return `${window.location.protocol}//${window.location.host}`
  }

  // Server-side detection with various environment fallbacks

  // 1. Explicit environment variable override (highest priority)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL
  }

  // 2. Vercel deployment detection
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`
  }

  // 3. Netlify deployment detection
  if (process.env.URL) {
    return process.env.URL
  }

  // 4. Railway deployment detection
  if (process.env.RAILWAY_STATIC_URL) {
    return process.env.RAILWAY_STATIC_URL
  }

  // 5. Render deployment detection
  if (process.env.RENDER_EXTERNAL_URL) {
    return process.env.RENDER_EXTERNAL_URL
  }

  // 6. Fallback for local development
  return "http://localhost:3000"
}
