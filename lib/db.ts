import { createServerSupabaseClient } from "./supabase"
import { nanoid } from "nanoid"

export interface LinkData {
  id: string
  originalUrl: string
  shortLink: string
  slug: string
  createdAt: string
  clicks: number
  name?: string
  campaignId?: string | null
  userId?: string | null
}

export interface AnalyticsData {
  id: string
  linkId: string
  timestamp: string
  ip: string | null
  userAgent: string | null
  referrer: string | null
  device: string | null
  country: string | null
  city: string | null
}

export interface QRCodeData {
  id: string
  linkId: string
  name: string
  description: string | null
  foregroundColor: string
  backgroundColor: string
  logoUrl: string | null
  size: number
  createdAt: string
  updatedAt: string
  qrCodeUrl: string
  userId?: string | null
}

export interface RedirectTemplateData {
  id: string
  name: string
  description: string | null
  isDefault: boolean
  countdownDuration: number
  showSkipButton: boolean
  showProgressBar: boolean
  adPlacement: string
  headerText: string
  footerText: string
  backgroundColor: string
  textColor: string
  accentColor: string
  customCSS: string | null
  customJS: string | null
  adCode: string | null
  logoEnabled: boolean
  logoUrl: string | null
  backgroundImageEnabled: boolean
  backgroundImageUrl: string | null
  videoEnabled: boolean
  videoUrl: string | null
  createdAt: string
  updatedAt: string
  userId: string | null
}

// Create a new link
export async function createLink(
  originalUrl: string,
  userId: string | null = null,
  options?: { name?: string; campaignId?: string },
): Promise<LinkData> {
  const supabase = createServerSupabaseClient()

  // Generate a unique slug
  const slug = nanoid(6)

  // Insert the link into the database
  const { data, error } = await supabase
    .from("links")
    .insert({
      original_url: originalUrl,
      slug,
      user_id: userId,
      meta: {
        clicks: 0,
        name: options?.name || originalUrl,
        campaignId: options?.campaignId || null,
      },
    })
    .select("id, original_url, slug, created_at, meta, user_id")
    .single()

  if (error) {
    console.error("Error creating link:", error)
    throw new Error("Failed to create link")
  }

  // Construct the short link
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const shortLink = `${baseUrl}/r/${data.slug}`

  return {
    id: data.id,
    originalUrl: data.original_url,
    shortLink,
    slug: data.slug,
    createdAt: data.created_at,
    clicks: data.meta?.clicks || 0,
    name: data.meta?.name || data.original_url,
    campaignId: data.meta?.campaignId || null,
    userId: data.user_id,
  }
}

// Get a link by slug
export async function getLinkBySlug(slug: string): Promise<LinkData | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, slug, created_at, meta, user_id")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    console.error("Error fetching link:", error)
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const shortLink = `${baseUrl}/r/${data.slug}`

  return {
    id: data.id,
    originalUrl: data.original_url,
    shortLink,
    slug: data.slug,
    createdAt: data.created_at,
    clicks: data.meta?.clicks || 0,
    name: data.meta?.name || data.original_url,
    campaignId: data.meta?.campaignId || null,
    userId: data.user_id,
  }
}

// Get all links for a user
export async function getUserLinks(userId: string): Promise<LinkData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, slug, created_at, meta, user_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user links:", error)
    return []
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return data.map((link) => ({
    id: link.id,
    originalUrl: link.original_url,
    shortLink: `${baseUrl}/r/${link.slug}`,
    slug: link.slug,
    createdAt: link.created_at,
    clicks: link.meta?.clicks || 0,
    name: link.meta?.name || link.original_url,
    campaignId: link.meta?.campaignId || null,
    userId: link.user_id,
  }))
}

// Get all links (admin only)
export async function getAllLinks(): Promise<LinkData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("links")
    .select("id, original_url, slug, created_at, meta, user_id")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching links:", error)
    return []
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return data.map((link) => ({
    id: link.id,
    originalUrl: link.original_url,
    shortLink: `${baseUrl}/r/${link.slug}`,
    slug: link.slug,
    createdAt: link.created_at,
    clicks: link.meta?.clicks || 0,
    name: link.meta?.name || link.original_url,
    campaignId: link.meta?.campaignId || null,
    userId: link.user_id,
  }))
}

// Track a link click
export async function trackLinkClick(
  linkId: string,
  data: {
    ip?: string
    userAgent?: string
    referrer?: string
    device?: string
    country?: string
    city?: string
  },
): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("analytics").insert({
    link_id: linkId,
    ip: data.ip || null,
    user_agent: data.userAgent || null,
    referrer: data.referrer || null,
    device: data.device || null,
    country: data.country || null,
    city: data.city || null,
  })

  if (error) {
    console.error("Error tracking link click:", error)
    throw new Error("Failed to track link click")
  }
}

// Get analytics for a link
export async function getLinkAnalytics(linkId: string): Promise<AnalyticsData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("analytics")
    .select("id, link_id, timestamp, ip, user_agent, referrer, device, country, city")
    .eq("link_id", linkId)
    .order("timestamp", { ascending: false })

  if (error) {
    console.error("Error fetching analytics:", error)
    return []
  }

  return data.map((item) => ({
    id: item.id,
    linkId: item.link_id,
    timestamp: item.timestamp,
    ip: item.ip,
    userAgent: item.user_agent,
    referrer: item.referrer,
    device: item.device,
    country: item.country,
    city: item.city,
  }))
}

// Get analytics summary for all links
export async function getAnalyticsSummary(): Promise<{
  deviceData: { name: string; value: number }[]
  referrerData: { name: string; value: number }[]
  clicksByDay: { date: string; clicks: number }[]
}> {
  const supabase = createServerSupabaseClient()

  // Get device data
  const { data: deviceData, error: deviceError } = await supabase
    .from("analytics")
    .select("device")
    .not("device", "is", null)

  if (deviceError) {
    console.error("Error fetching device data:", deviceError)
    return {
      deviceData: [],
      referrerData: [],
      clicksByDay: [],
    }
  }

  // Count devices
  const deviceCounts: Record<string, number> = {}
  deviceData.forEach((item) => {
    const device = item.device || "unknown"
    deviceCounts[device] = (deviceCounts[device] || 0) + 1
  })

  // Get referrer data
  const { data: referrerData, error: referrerError } = await supabase.from("analytics").select("referrer")

  if (referrerError) {
    console.error("Error fetching referrer data:", referrerError)
    return {
      deviceData: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
      referrerData: [],
      clicksByDay: [],
    }
  }

  // Count referrers
  const referrerCounts: Record<string, number> = {}
  referrerData.forEach((item) => {
    const referrer = item.referrer
      ? item.referrer.includes("google")
        ? "Google"
        : item.referrer.includes("facebook")
          ? "Facebook"
          : item.referrer.includes("twitter")
            ? "Twitter"
            : item.referrer.includes("instagram")
              ? "Instagram"
              : "Other"
      : "Direct"

    referrerCounts[referrer] = (referrerCounts[referrer] || 0) + 1
  })

  // Get clicks by day for the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: clicksData, error: clicksError } = await supabase
    .from("analytics")
    .select("timestamp")
    .gte("timestamp", thirtyDaysAgo.toISOString())
    .order("timestamp", { ascending: true })

  if (clicksError) {
    console.error("Error fetching clicks data:", clicksError)
    return {
      deviceData: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
      referrerData: Object.entries(referrerCounts).map(([name, value]) => ({ name, value })),
      clicksByDay: [],
    }
  }

  // Count clicks by day
  const clicksByDay: Record<string, number> = {}
  clicksData.forEach((item) => {
    const date = new Date(item.timestamp).toISOString().split("T")[0]
    clicksByDay[date] = (clicksByDay[date] || 0) + 1
  })

  return {
    deviceData: Object.entries(deviceCounts).map(([name, value]) => ({ name, value })),
    referrerData: Object.entries(referrerCounts).map(([name, value]) => ({ name, value })),
    clicksByDay: Object.entries(clicksByDay).map(([date, clicks]) => ({ date, clicks })),
  }
}

// Delete a link
export async function deleteLink(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("links").delete().eq("id", id)

  if (error) {
    console.error("Error deleting link:", error)
    throw new Error("Failed to delete link")
  }
}

// QR Code Functions

// Create a new QR code
export async function createQRCode(data: {
  linkId: string
  name: string
  description?: string
  foregroundColor?: string
  backgroundColor?: string
  logoUrl?: string
  size?: number
  userId?: string
}): Promise<QRCodeData> {
  const supabase = createServerSupabaseClient()

  const { error: linkCheckError, count } = await supabase
    .from("links")
    .select("id", { count: "exact", head: true })
    .eq("id", data.linkId)

  if (linkCheckError || count === 0) {
    console.error("Error checking link existence:", linkCheckError)
    throw new Error("Link not found")
  }

  const { data: qrCodeData, error } = await supabase
    .from("qr_codes")
    .insert({
      link_id: data.linkId,
      name: data.name,
      description: data.description || null,
      foreground_color: data.foregroundColor || "#000000",
      background_color: data.backgroundColor || "#FFFFFF",
      logo_url: data.logoUrl || null,
      size: data.size || 300,
      user_id: data.userId || null,
    })
    .select(
      "id, link_id, name, description, foreground_color, background_color, logo_url, size, created_at, updated_at, user_id",
    )
    .single()

  if (error) {
    console.error("Error creating QR code:", error)
    throw new Error("Failed to create QR code")
  }

  // Get the link data to construct the QR code URL
  const { data: linkData, error: linkError } = await supabase
    .from("links")
    .select("slug")
    .eq("id", data.linkId)
    .single()

  if (linkError) {
    console.error("Error fetching link data:", linkError)
    throw new Error("Failed to fetch link data")
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const qrCodeUrl = `${baseUrl}/r/${linkData.slug}`

  return {
    id: qrCodeData.id,
    linkId: qrCodeData.link_id,
    name: qrCodeData.name,
    description: qrCodeData.description,
    foregroundColor: qrCodeData.foreground_color,
    backgroundColor: qrCodeData.background_color,
    logoUrl: qrCodeData.logo_url,
    size: qrCodeData.size,
    createdAt: qrCodeData.created_at,
    updatedAt: qrCodeData.updated_at,
    qrCodeUrl,
    userId: qrCodeData.user_id,
  }
}

// Get QR codes for a user
export async function getUserQRCodes(userId: string): Promise<QRCodeData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("qr_codes")
    .select(
      "id, link_id, name, description, foreground_color, background_color, logo_url, size, created_at, updated_at, user_id",
    )
    .eq("user_id", userId)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching user QR codes:", error)
    return []
  }

  // Get all links to construct QR code URLs
  const { data: linksData, error: linksError } = await supabase.from("links").select("id, slug")

  if (linksError) {
    console.error("Error fetching links data:", linksError)
    return []
  }

  const linkMap = new Map(linksData.map((link) => [link.id, link.slug]))
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return data.map((qrCode) => {
    const slug = linkMap.get(qrCode.link_id)
    const qrCodeUrl = slug ? `${baseUrl}/r/${slug}` : ""

    return {
      id: qrCode.id,
      linkId: qrCode.link_id,
      name: qrCode.name,
      description: qrCode.description,
      foregroundColor: qrCode.foreground_color,
      backgroundColor: qrCode.background_color,
      logoUrl: qrCode.logo_url,
      size: qrCode.size,
      createdAt: qrCode.created_at,
      updatedAt: qrCode.updated_at,
      qrCodeUrl,
      userId: qrCode.user_id,
    }
  })
}

// Get all QR codes (admin only)
export async function getAllQRCodes(): Promise<QRCodeData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("qr_codes")
    .select(
      "id, link_id, name, description, foreground_color, background_color, logo_url, size, created_at, updated_at, user_id",
    )
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching QR codes:", error)
    return []
  }

  // Get all links to construct QR code URLs
  const { data: linksData, error: linksError } = await supabase.from("links").select("id, slug")

  if (linksError) {
    console.error("Error fetching links data:", linksError)
    return []
  }

  const linkMap = new Map(linksData.map((link) => [link.id, link.slug]))
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"

  return data.map((qrCode) => {
    const slug = linkMap.get(qrCode.link_id)
    const qrCodeUrl = slug ? `${baseUrl}/r/${slug}` : ""

    return {
      id: qrCode.id,
      linkId: qrCode.link_id,
      name: qrCode.name,
      description: qrCode.description,
      foregroundColor: qrCode.foreground_color,
      backgroundColor: qrCode.background_color,
      logoUrl: qrCode.logo_url,
      size: qrCode.size,
      createdAt: qrCode.created_at,
      updatedAt: qrCode.updated_at,
      qrCodeUrl,
      userId: qrCode.user_id,
    }
  })
}

// Get QR code by ID
export async function getQRCodeById(id: string): Promise<QRCodeData | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("qr_codes")
    .select(
      "id, link_id, name, description, foreground_color, background_color, logo_url, size, created_at, updated_at, user_id",
    )
    .eq("id", id)
    .single()

  if (error) {
    console.error("Error fetching QR code:", error)
    return null
  }

  // Get the link data to construct the QR code URL
  const { data: linkData, error: linkError } = await supabase
    .from("links")
    .select("slug")
    .eq("id", data.link_id)
    .single()

  if (linkError) {
    console.error("Error fetching link data:", linkError)
    return null
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const qrCodeUrl = `${baseUrl}/r/${linkData.slug}`

  return {
    id: data.id,
    linkId: data.link_id,
    name: data.name,
    description: data.description,
    foregroundColor: data.foreground_color,
    backgroundColor: data.background_color,
    logoUrl: data.logo_url,
    size: data.size,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    qrCodeUrl,
    userId: data.user_id,
  }
}

// Update QR code
export async function updateQRCode(
  id: string,
  data: {
    name?: string
    description?: string
    foregroundColor?: string
    backgroundColor?: string
    logoUrl?: string
    size?: number
  },
): Promise<QRCodeData> {
  const supabase = createServerSupabaseClient()

  const updateData: Record<string, any> = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.description !== undefined) updateData.description = data.description
  if (data.foregroundColor !== undefined) updateData.foreground_color = data.foregroundColor
  if (data.backgroundColor !== undefined) updateData.background_color = data.backgroundColor
  if (data.logoUrl !== undefined) updateData.logo_url = data.logoUrl
  if (data.size !== undefined) updateData.size = data.size
  updateData.updated_at = new Date().toISOString()

  const { data: qrCodeData, error } = await supabase
    .from("qr_codes")
    .update(updateData)
    .eq("id", id)
    .select(
      "id, link_id, name, description, foreground_color, background_color, logo_url, size, created_at, updated_at, user_id",
    )
    .single()

  if (error) {
    console.error("Error updating QR code:", error)
    throw new Error("Failed to update QR code")
  }

  // Get the link data to construct the QR code URL
  const { data: linkData, error: linkError } = await supabase
    .from("links")
    .select("slug")
    .eq("id", qrCodeData.link_id)
    .single()

  if (linkError) {
    console.error("Error fetching link data:", linkError)
    throw new Error("Failed to fetch link data")
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  const qrCodeUrl = `${baseUrl}/r/${linkData.slug}`

  return {
    id: qrCodeData.id,
    linkId: qrCodeData.link_id,
    name: qrCodeData.name,
    description: qrCodeData.description,
    foregroundColor: qrCodeData.foreground_color,
    backgroundColor: qrCodeData.background_color,
    logoUrl: qrCodeData.logo_url,
    size: qrCodeData.size,
    createdAt: qrCodeData.created_at,
    updatedAt: qrCodeData.updated_at,
    qrCodeUrl,
    userId: qrCodeData.user_id,
  }
}

// Delete QR code
export async function deleteQRCode(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  const { error } = await supabase.from("qr_codes").delete().eq("id", id)

  if (error) {
    console.error("Error deleting QR code:", error)
    throw new Error("Failed to delete QR code")
  }
}

// Redirect Template Functions

// Get default redirect template
export async function getDefaultRedirectTemplate(): Promise<RedirectTemplateData | null> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase.from("redirect_templates").select("*").eq("is_default", true).single()

  if (error) {
    console.error("Error fetching default redirect template:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    isDefault: data.is_default,
    countdownDuration: data.countdown_duration,
    showSkipButton: data.show_skip_button,
    showProgressBar: data.show_progress_bar,
    adPlacement: data.ad_placement,
    headerText: data.header_text,
    footerText: data.footer_text,
    backgroundColor: data.background_color,
    textColor: data.text_color,
    accentColor: data.accent_color,
    customCSS: data.custom_css,
    customJS: data.custom_js,
    adCode: data.ad_code,
    logoEnabled: data.logo_enabled,
    logoUrl: data.logo_url,
    backgroundImageEnabled: data.background_image_enabled,
    backgroundImageUrl: data.background_image_url,
    videoEnabled: data.video_enabled,
    videoUrl: data.video_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
  }
}

// Get all redirect templates
export async function getAllRedirectTemplates(): Promise<RedirectTemplateData[]> {
  const supabase = createServerSupabaseClient()

  const { data, error } = await supabase
    .from("redirect_templates")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching redirect templates:", error)
    return []
  }

  return data.map((template) => ({
    id: template.id,
    name: template.name,
    description: template.description,
    isDefault: template.is_default,
    countdownDuration: template.countdown_duration,
    showSkipButton: template.show_skip_button,
    showProgressBar: template.show_progress_bar,
    adPlacement: template.ad_placement,
    headerText: template.header_text,
    footerText: template.footer_text,
    backgroundColor: template.background_color,
    textColor: template.text_color,
    accentColor: template.accent_color,
    customCSS: template.custom_css,
    customJS: template.custom_js,
    adCode: template.ad_code,
    logoEnabled: template.logo_enabled,
    logoUrl: template.logo_url,
    backgroundImageEnabled: template.background_image_enabled,
    backgroundImageUrl: template.background_image_url,
    videoEnabled: template.video_enabled,
    videoUrl: template.video_url,
    createdAt: template.created_at,
    updatedAt: template.updated_at,
    userId: template.user_id,
  }))
}

// Create a new redirect template
export async function createRedirectTemplate(
  template: Omit<RedirectTemplateData, "id" | "createdAt" | "updatedAt">,
): Promise<RedirectTemplateData> {
  const supabase = createServerSupabaseClient()

  // If this is set as default, update other templates
  if (template.isDefault) {
    await supabase.from("redirect_templates").update({ is_default: false }).eq("is_default", true)
  }

  const { data, error } = await supabase
    .from("redirect_templates")
    .insert({
      name: template.name,
      description: template.description,
      is_default: template.isDefault,
      countdown_duration: template.countdownDuration,
      show_skip_button: template.showSkipButton,
      show_progress_bar: template.showProgressBar,
      ad_placement: template.adPlacement,
      header_text: template.headerText,
      footer_text: template.footerText,
      background_color: template.backgroundColor,
      text_color: template.textColor,
      accent_color: template.accentColor,
      custom_css: template.customCSS,
      custom_js: template.customJS,
      ad_code: template.adCode,
      logo_enabled: template.logoEnabled,
      logo_url: template.logoUrl,
      background_image_enabled: template.backgroundImageEnabled,
      background_image_url: template.backgroundImageUrl,
      video_enabled: template.videoEnabled,
      video_url: template.videoUrl,
      user_id: template.userId,
    })
    .select("*")
    .single()

  if (error) {
    console.error("Error creating redirect template:", error)
    throw new Error("Failed to create redirect template")
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    isDefault: data.is_default,
    countdownDuration: data.countdown_duration,
    showSkipButton: data.show_skip_button,
    showProgressBar: data.show_progress_bar,
    adPlacement: data.ad_placement,
    headerText: data.header_text,
    footerText: data.footer_text,
    backgroundColor: data.background_color,
    textColor: data.text_color,
    accentColor: data.accent_color,
    customCSS: data.custom_css,
    customJS: data.custom_js,
    adCode: data.ad_code,
    logoEnabled: data.logo_enabled,
    logoUrl: data.logo_url,
    backgroundImageEnabled: data.background_image_enabled,
    backgroundImageUrl: data.background_image_url,
    videoEnabled: data.video_enabled,
    videoUrl: data.video_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
  }
}

// Update a redirect template
export async function updateRedirectTemplate(
  id: string,
  template: Partial<RedirectTemplateData>,
): Promise<RedirectTemplateData> {
  const supabase = createServerSupabaseClient()

  // If this is set as default, update other templates
  if (template.isDefault) {
    await supabase.from("redirect_templates").update({ is_default: false }).eq("is_default", true)
  }

  const updateData: Record<string, any> = {}
  if (template.name !== undefined) updateData.name = template.name
  if (template.description !== undefined) updateData.description = template.description
  if (template.isDefault !== undefined) updateData.is_default = template.isDefault
  if (template.countdownDuration !== undefined) updateData.countdown_duration = template.countdownDuration
  if (template.showSkipButton !== undefined) updateData.show_skip_button = template.showSkipButton
  if (template.showProgressBar !== undefined) updateData.show_progress_bar = template.showProgressBar
  if (template.adPlacement !== undefined) updateData.ad_placement = template.adPlacement
  if (template.headerText !== undefined) updateData.header_text = template.headerText
  if (template.footerText !== undefined) updateData.footer_text = template.footerText
  if (template.backgroundColor !== undefined) updateData.background_color = template.backgroundColor
  if (template.textColor !== undefined) updateData.text_color = template.textColor
  if (template.accentColor !== undefined) updateData.accent_color = template.accentColor
  if (template.customCSS !== undefined) updateData.custom_css = template.customCSS
  if (template.customJS !== undefined) updateData.custom_js = template.customJS
  if (template.adCode !== undefined) updateData.ad_code = template.adCode
  if (template.logoEnabled !== undefined) updateData.logo_enabled = template.logoEnabled
  if (template.logoUrl !== undefined) updateData.logo_url = template.logoUrl
  if (template.backgroundImageEnabled !== undefined)
    updateData.background_image_enabled = template.backgroundImageEnabled
  if (template.backgroundImageUrl !== undefined) updateData.background_image_url = template.backgroundImageUrl
  if (template.videoEnabled !== undefined) updateData.video_enabled = template.videoEnabled
  if (template.videoUrl !== undefined) updateData.video_url = template.videoUrl
  updateData.updated_at = new Date().toISOString()

  const { data, error } = await supabase.from("redirect_templates").update(updateData).eq("id", id).select("*").single()

  if (error) {
    console.error("Error updating redirect template:", error)
    throw new Error("Failed to update redirect template")
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    isDefault: data.is_default,
    countdownDuration: data.countdown_duration,
    showSkipButton: data.show_skip_button,
    showProgressBar: data.show_progress_bar,
    adPlacement: data.ad_placement,
    headerText: data.header_text,
    footerText: data.footer_text,
    backgroundColor: data.background_color,
    textColor: data.text_color,
    accentColor: data.accent_color,
    customCSS: data.custom_css,
    customJS: data.custom_js,
    adCode: data.ad_code,
    logoEnabled: data.logo_enabled,
    logoUrl: data.logo_url,
    backgroundImageEnabled: data.background_image_enabled,
    backgroundImageUrl: data.background_image_url,
    videoEnabled: data.video_enabled,
    videoUrl: data.video_url,
    createdAt: data.created_at,
    updatedAt: data.updated_at,
    userId: data.user_id,
  }
}

// Delete a redirect template
export async function deleteRedirectTemplate(id: string): Promise<void> {
  const supabase = createServerSupabaseClient()

  // Check if this is the default template
  const { data: template, error: checkError } = await supabase
    .from("redirect_templates")
    .select("is_default")
    .eq("id", id)
    .single()

  if (checkError) {
    console.error("Error checking template:", checkError)
    throw new Error("Failed to check template")
  }

  if (template.is_default) {
    throw new Error("Cannot delete the default template")
  }

  const { error } = await supabase.from("redirect_templates").delete().eq("id", id)

  if (error) {
    console.error("Error deleting redirect template:", error)
    throw new Error("Failed to delete redirect template")
  }
}
