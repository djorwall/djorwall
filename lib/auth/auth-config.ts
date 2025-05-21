// Authentication configuration
export const authConfig = {
  // Enable/disable authentication system
  enabled: false,

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

// Helper function to get a safe redirect URL
export function getSafeRedirectUrl(url: string | null | undefined): string {
  if (!url) return authConfig.defaultRedirectUrl

  try {
    // Check if it's a relative URL (starts with /)
    if (url.startsWith("/")) {
      // Check if it's in the allowed list
      return authConfig.allowedRedirectUrls.some((allowedUrl) => url === allowedUrl || url.startsWith(`${allowedUrl}/`))
        ? url
        : authConfig.defaultRedirectUrl
    }

    // If it's an absolute URL, check if it's for our domain
    const siteUrl = process.env.NEXT_PUBLIC_APP_URL || "https://appopener.io"
    const siteHostname = new URL(siteUrl).hostname
    const urlHostname = new URL(url).hostname

    return siteHostname === urlHostname ? url : authConfig.defaultRedirectUrl
  } catch (error) {
    console.error("Error validating redirect URL:", error)
    return authConfig.defaultRedirectUrl
  }
}
