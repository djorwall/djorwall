"use server"

import { headers } from "next/headers"
import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import {
  createLink,
  trackLinkClick,
  getLinkBySlug,
  getAllLinks,
  getUserLinks,
  deleteLink,
  getAnalyticsSummary,
  createQRCode,
  getAllQRCodes,
  getUserQRCodes,
  getQRCodeById,
  updateQRCode,
  deleteQRCode,
  getDefaultRedirectTemplate,
  getAllRedirectTemplates,
  createRedirectTemplate,
  updateRedirectTemplate,
  deleteRedirectTemplate,
} from "@/lib/db"
import { detectPlatform } from "@/lib/deep-link-utils"
import { testDatabaseConnection } from "@/lib/db-test"
import QRCode from "qrcode"
import type { RedirectTemplateData } from "@/lib/db"

// Get the authenticated user from the server action
async function getAuthenticatedUser() {
  const supabase = createServerActionClient({ cookies })
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.user || null
}

export async function generateDeepLinkAction(formData: FormData) {
  try {
    const url = formData.get("url") as string

    if (!url) {
      return { success: false, error: "URL is required" }
    }

    const user = await getAuthenticatedUser()
    const link = await createLink(url, user?.id || null)

    return {
      success: true,
      shortLink: link.shortLink,
      originalUrl: link.originalUrl,
    }
  } catch (error) {
    console.error("Error generating deep link:", error)
    return { success: false, error: "Failed to generate link" }
  }
}

export async function createCampaignLinkAction(url: string, name: string, campaignId?: string) {
  try {
    if (!url) {
      return { success: false, error: "URL is required" }
    }

    const user = await getAuthenticatedUser()
    const link = await createLink(url, user?.id || null, {
      name,
      campaignId,
    })

    return {
      success: true,
      id: link.id,
      shortLink: link.shortLink,
      originalUrl: link.originalUrl,
    }
  } catch (error) {
    console.error("Error creating campaign link:", error)
    return { success: false, error: "Failed to create link" }
  }
}

export async function getRedirectInfoAction(slug: string) {
  try {
    const link = await getLinkBySlug(slug)

    if (!link) {
      return { success: false, error: "Link not found" }
    }

    return {
      success: true,
      originalUrl: link.originalUrl,
      id: link.id,
    }
  } catch (error) {
    console.error("Error getting redirect info:", error)
    return { success: false, error: "Failed to get redirect info" }
  }
}

export async function trackClickAction(linkId: string) {
  try {
    const headersList = headers()
    const userAgent = headersList.get("user-agent") || ""
    const referer = headersList.get("referer") || ""
    const ip = headersList.get("x-forwarded-for") || "127.0.0.1"

    // In a real app, you would use a service like ipinfo.io to get country and city
    // For this demo, we'll just use placeholder values

    await trackLinkClick(linkId, {
      ip,
      userAgent,
      referrer: referer,
      device: detectPlatform(),
      country: "Unknown",
      city: "Unknown",
    })

    return { success: true }
  } catch (error) {
    console.error("Error tracking click:", error)
    return { success: false, error: "Failed to track click" }
  }
}

export async function getLinksAction() {
  try {
    const user = await getAuthenticatedUser()

    // If user is authenticated, get their links
    // Otherwise, return an empty array
    const links = user ? await getUserLinks(user.id) : []

    return {
      success: true,
      links,
    }
  } catch (error) {
    console.error("Error getting links:", error)
    return { success: false, error: "Failed to get links" }
  }
}

export async function getAllLinksAction() {
  try {
    // This action should only be called by admins
    const links = await getAllLinks()

    return {
      success: true,
      links,
    }
  } catch (error) {
    console.error("Error getting all links:", error)
    return { success: false, error: "Failed to get all links" }
  }
}

export async function deleteLinkAction(id: string) {
  try {
    await deleteLink(id)

    return { success: true }
  } catch (error) {
    console.error("Error deleting link:", error)
    return { success: false, error: "Failed to delete link" }
  }
}

export async function getAnalyticsAction() {
  try {
    const analytics = await getAnalyticsSummary()

    return {
      success: true,
      analytics,
    }
  } catch (error) {
    console.error("Error getting analytics:", error)
    return { success: false, error: "Failed to get analytics" }
  }
}

export async function testDatabaseConnectionAction() {
  return await testDatabaseConnection()
}

// QR Code Actions

export async function generateQRCodeAction(formData: FormData) {
  try {
    const linkId = formData.get("linkId") as string
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const foregroundColor = formData.get("foregroundColor") as string
    const backgroundColor = formData.get("backgroundColor") as string
    const size = Number.parseInt(formData.get("size") as string) || 300

    if (!linkId) {
      return { success: false, error: "Link ID is required" }
    }

    if (!name) {
      return { success: false, error: "Name is required" }
    }

    const user = await getAuthenticatedUser()

    const qrCode = await createQRCode({
      linkId,
      name,
      description,
      foregroundColor,
      backgroundColor,
      size,
      userId: user?.id,
    })

    // Generate QR code data URL
    const qrCodeDataUrl = await QRCode.toDataURL(qrCode.qrCodeUrl, {
      width: qrCode.size,
      margin: 1,
      color: {
        dark: qrCode.foregroundColor,
        light: qrCode.backgroundColor,
      },
    })

    return {
      success: true,
      qrCode: {
        ...qrCode,
        dataUrl: qrCodeDataUrl,
      },
    }
  } catch (error) {
    console.error("Error generating QR code:", error)
    return { success: false, error: "Failed to generate QR code" }
  }
}

export async function getQRCodesAction() {
  try {
    const user = await getAuthenticatedUser()

    // If user is authenticated, get their QR codes
    // Otherwise, return an empty array
    const qrCodes = user ? await getUserQRCodes(user.id) : []

    // Generate QR code data URLs for each QR code
    const qrCodesWithDataUrls = await Promise.all(
      qrCodes.map(async (qrCode) => {
        const dataUrl = await QRCode.toDataURL(qrCode.qrCodeUrl, {
          width: qrCode.size,
          margin: 1,
          color: {
            dark: qrCode.foregroundColor,
            light: qrCode.backgroundColor,
          },
        })

        return {
          ...qrCode,
          dataUrl,
        }
      }),
    )

    return {
      success: true,
      qrCodes: qrCodesWithDataUrls,
    }
  } catch (error) {
    console.error("Error getting QR codes:", error)
    return { success: false, error: "Failed to get QR codes" }
  }
}

export async function getAllQRCodesAction() {
  try {
    // This action should only be called by admins
    const qrCodes = await getAllQRCodes()

    // Generate QR code data URLs for each QR code
    const qrCodesWithDataUrls = await Promise.all(
      qrCodes.map(async (qrCode) => {
        const dataUrl = await QRCode.toDataURL(qrCode.qrCodeUrl, {
          width: qrCode.size,
          margin: 1,
          color: {
            dark: qrCode.foregroundColor,
            light: qrCode.backgroundColor,
          },
        })

        return {
          ...qrCode,
          dataUrl,
        }
      }),
    )

    return {
      success: true,
      qrCodes: qrCodesWithDataUrls,
    }
  } catch (error) {
    console.error("Error getting all QR codes:", error)
    return { success: false, error: "Failed to get all QR codes" }
  }
}

export async function getQRCodeAction(id: string) {
  try {
    const qrCode = await getQRCodeById(id)

    if (!qrCode) {
      return { success: false, error: "QR code not found" }
    }

    // Generate QR code data URL
    const dataUrl = await QRCode.toDataURL(qrCode.qrCodeUrl, {
      width: qrCode.size,
      margin: 1,
      color: {
        dark: qrCode.foregroundColor,
        light: qrCode.backgroundColor,
      },
    })

    return {
      success: true,
      qrCode: {
        ...qrCode,
        dataUrl,
      },
    }
  } catch (error) {
    console.error("Error getting QR code:", error)
    return { success: false, error: "Failed to get QR code" }
  }
}

export async function updateQRCodeAction(id: string, formData: FormData) {
  try {
    const name = formData.get("name") as string
    const description = formData.get("description") as string
    const foregroundColor = formData.get("foregroundColor") as string
    const backgroundColor = formData.get("backgroundColor") as string
    const size = Number.parseInt(formData.get("size") as string) || undefined

    if (!name) {
      return { success: false, error: "Name is required" }
    }

    const qrCode = await updateQRCode(id, {
      name,
      description,
      foregroundColor,
      backgroundColor,
      size,
    })

    // Generate QR code data URL
    const dataUrl = await QRCode.toDataURL(qrCode.qrCodeUrl, {
      width: qrCode.size,
      margin: 1,
      color: {
        dark: qrCode.foregroundColor,
        light: qrCode.backgroundColor,
      },
    })

    return {
      success: true,
      qrCode: {
        ...qrCode,
        dataUrl,
      },
    }
  } catch (error) {
    console.error("Error updating QR code:", error)
    return { success: false, error: "Failed to update QR code" }
  }
}

export async function deleteQRCodeAction(id: string) {
  try {
    await deleteQRCode(id)

    return { success: true }
  } catch (error) {
    console.error("Error deleting QR code:", error)
    return { success: false, error: "Failed to delete QR code" }
  }
}

// Redirect Template Actions

export async function getDefaultRedirectTemplateAction() {
  try {
    const template = await getDefaultRedirectTemplate()

    if (!template) {
      return { success: false, error: "Default template not found" }
    }

    return {
      success: true,
      template,
    }
  } catch (error) {
    console.error("Error getting default redirect template:", error)
    return { success: false, error: "Failed to get default redirect template" }
  }
}

export async function getAllRedirectTemplatesAction() {
  try {
    const templates = await getAllRedirectTemplates()

    return {
      success: true,
      templates,
    }
  } catch (error) {
    console.error("Error getting all redirect templates:", error)
    return { success: false, error: "Failed to get all redirect templates" }
  }
}

export async function createRedirectTemplateAction(
  template: Omit<RedirectTemplateData, "id" | "createdAt" | "updatedAt">,
) {
  try {
    const user = await getAuthenticatedUser()

    const newTemplate = await createRedirectTemplate({
      ...template,
      userId: user?.id || null,
    })

    return {
      success: true,
      template: newTemplate,
    }
  } catch (error) {
    console.error("Error creating redirect template:", error)
    return { success: false, error: "Failed to create redirect template" }
  }
}

export async function updateRedirectTemplateAction(id: string, template: Partial<RedirectTemplateData>) {
  try {
    const updatedTemplate = await updateRedirectTemplate(id, template)

    return {
      success: true,
      template: updatedTemplate,
    }
  } catch (error) {
    console.error("Error updating redirect template:", error)
    return { success: false, error: "Failed to update redirect template" }
  }
}

export async function deleteRedirectTemplateAction(id: string) {
  try {
    await deleteRedirectTemplate(id)

    return { success: true }
  } catch (error) {
    console.error("Error deleting redirect template:", error)
    return { success: false, error: "Failed to delete redirect template" }
  }
}
