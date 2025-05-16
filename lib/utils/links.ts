import { nanoid } from "nanoid"

// Generate a short ID for links
export function generateShortId(length = 6): string {
  return nanoid(length)
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch (error) {
    return false
  }
}

// Parse user agent to get device info
export function parseUserAgent(userAgent: string) {
  const ua = userAgent.toLowerCase()

  // Detect device type
  let deviceType = "unknown"
  if (/mobile|android|iphone|ipad|ipod|windows phone/i.test(ua)) {
    deviceType = "mobile"
  } else if (/tablet|ipad/i.test(ua)) {
    deviceType = "tablet"
  } else if (/windows|macintosh|linux/i.test(ua)) {
    deviceType = "desktop"
  }

  // Detect OS
  let os = "unknown"
  if (/windows/i.test(ua)) {
    os = "windows"
  } else if (/macintosh|mac os/i.test(ua)) {
    os = "macos"
  } else if (/linux/i.test(ua)) {
    os = "linux"
  } else if (/android/i.test(ua)) {
    os = "android"
  } else if (/iphone|ipad|ipod/i.test(ua)) {
    os = "ios"
  }

  // Detect browser
  let browser = "unknown"
  if (/chrome/i.test(ua) && !/edg|edge/i.test(ua)) {
    browser = "chrome"
  } else if (/firefox/i.test(ua)) {
    browser = "firefox"
  } else if (/safari/i.test(ua) && !/chrome/i.test(ua)) {
    browser = "safari"
  } else if (/edg|edge/i.test(ua)) {
    browser = "edge"
  } else if (/opera|opr/i.test(ua)) {
    browser = "opera"
  }

  return {
    deviceType,
    os,
    browser,
  }
}

// Format date for display
export function formatDate(date: string | Date): string {
  const d = new Date(date)
  const now = new Date()

  const diffInSeconds = Math.floor((now.getTime() - d.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "just now"
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60)
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600)
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400)
    return `${days} ${days === 1 ? "day" : "days"} ago`
  } else {
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }
}
