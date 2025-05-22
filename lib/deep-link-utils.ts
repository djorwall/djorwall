import { nanoid } from "nanoid"

// Platform detection
export function detectPlatform(): "ios" | "android" | "other" {
  if (typeof window === "undefined") return "other"

  const userAgent = navigator.userAgent || navigator.vendor || (window as any).opera || ""

  if (/android/i.test(userAgent)) return "android"
  if (/iPad|iPhone|iPod/.test(userAgent) && !(window as any).MSStream) return "ios"

  return "other"
}

// App detection based on URL
export function detectApp(url: string): string | null {
  try {
    const urlObj = new URL(url)
    const hostname = urlObj.hostname

    // Simple detection based on hostname
    if (hostname.includes("youtube.com") || hostname.includes("youtu.be")) return "youtube"
    if (hostname.includes("instagram.com")) return "instagram"
    if (hostname.includes("facebook.com")) return "facebook"
    if (hostname.includes("twitter.com") || hostname.includes("x.com")) return "twitter"
    if (hostname.includes("tiktok.com")) return "tiktok"
    if (hostname.includes("spotify.com")) return "spotify"

    return null
  } catch (error) {
    console.error("Invalid URL:", error)
    return null
  }
}

// Generate app-specific deep link
export function generateAppDeepLink(url: string, platform: "ios" | "android" | "other", app: string | null): string {
  if (!app) return url

  // This is a simplified version - in a real app, you'd have more complex logic
  // and possibly use a database of deep link formats for different apps

  switch (app) {
    case "youtube":
      const videoId = extractYouTubeVideoId(url)
      if (videoId) {
        if (platform === "ios") return `youtube://www.youtube.com/watch?v=${videoId}`
        if (platform === "android") return `vnd.youtube:${videoId}`
      }
      break

    case "instagram":
      // Extract username or post ID
      if (url.includes("/p/")) {
        const postId = url.split("/p/")[1]?.split("/")[0]
        if (postId) return `instagram://media?id=${postId}`
      } else {
        const username = url.split("instagram.com/")[1]?.split("/")[0]
        if (username) return `instagram://user?username=${username}`
      }
      break

    // Add more apps as needed
  }

  return url
}

// Helper function to extract YouTube video ID
function extractYouTubeVideoId(url: string): string | null {
  try {
    const urlObj = new URL(url)

    // youtube.com/watch?v=VIDEO_ID format
    if (urlObj.searchParams.has("v")) {
      return urlObj.searchParams.get("v")
    }

    // youtu.be/VIDEO_ID format
    if (urlObj.hostname === "youtu.be") {
      return urlObj.pathname.substring(1)
    }

    return null
  } catch (error) {
    return null
  }
}

// Generate a unique slug
export function generateSlug(): string {
  return nanoid(6) // 6-character alphanumeric ID
}

// Validate URL
export function validateUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// Main function to generate a deep link
export async function generateDeepLink(url: string): Promise<string> {
  if (!validateUrl(url)) {
    throw new Error("Invalid URL")
  }

  const slug = generateSlug()
  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://appopener.io"
  const shortLink = `${baseUrl}/r/${slug}`

  // In a real app, you would save this to a database
  // For this demo, we'll just return the short link

  return shortLink
}

// Track link click
export function trackLinkClick(slug: string) {
  // In a real app, you would send this to your analytics API
  const data = {
    slug,
    timestamp: new Date().toISOString(),
    ip: "127.0.0.1", // In a real app, this would be the actual IP
    device: detectPlatform(),
    referrer: document.referrer || "direct",
    userAgent: navigator.userAgent,
  }

  console.log("Link click tracked:", data)

  // Update local storage for demo purposes
  const links = JSON.parse(sessionStorage.getItem("appopener_links") || "[]")
  const updatedLinks = links.map((link: any) => {
    if (link.shortLink.includes(slug)) {
      return { ...link, clicks: (link.clicks || 0) + 1 }
    }
    return link
  })

  sessionStorage.setItem("appopener_links", JSON.stringify(updatedLinks))

  return data
}
