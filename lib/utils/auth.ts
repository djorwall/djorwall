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
      // Check if it's in the allowed list
      const allowedPaths = ["/dashboard", "/admin"]
      return allowedPaths.some((allowedPath) => url === allowedPath || url.startsWith(`${allowedPath}/`))
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

/**
 * Gets a safe redirect URL
 * @param url The URL to validate
 * @returns A safe URL to redirect to
 */
export function getSafeRedirectUrl(url: string | null | undefined): string {
  if (!url) return "/dashboard"
  return isValidRedirectUrl(url) ? url : "/dashboard"
}
