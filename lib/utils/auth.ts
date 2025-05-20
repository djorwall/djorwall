/**
 * Validates if a redirect URL is safe to use
 * @param url The URL to validate
 * @returns boolean indicating if the URL is valid and safe
 */
export function isValidRedirectUrl(url: string): boolean {
  if (!url) return false

  try {
    // Check if it's a relative URL (starts with /)
    if (url.startsWith("/")) {
      // Don't allow redirects to authentication pages to prevent loops
      const authPaths = ["/login", "/signup", "/auth/"]
      return !authPaths.some((path) => url.startsWith(path))
    }

    // If it's an absolute URL, check if it's for our domain
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"
    const siteHostname = new URL(siteUrl).hostname
    const urlHostname = new URL(url).hostname

    return siteHostname === urlHostname
  } catch (error) {
    console.error("Error validating redirect URL:", error)
    return false
  }
}
