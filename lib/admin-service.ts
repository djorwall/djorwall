import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"

export async function getAgentStats() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get total agents count
  const { count: totalAgents } = await supabase.from("agent_profiles").select("*", { count: "exact", head: true })

  // Get verified agents count
  const { count: verifiedAgents } = await supabase
    .from("agent_profiles")
    .select("*", { count: "exact", head: true })
    .eq("is_verified", true)

  // Get agents registered in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: newAgents } = await supabase
    .from("agent_profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString())

  return {
    totalAgents: totalAgents || 0,
    verifiedAgents: verifiedAgents || 0,
    newAgents: newAgents || 0,
    verificationRate: totalAgents ? Math.round(((verifiedAgents || 0) / totalAgents) * 100) : 0,
  }
}

export async function getBrandStats() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get total brands count
  const { count: totalBrands } = await supabase.from("brand_profiles").select("*", { count: "exact", head: true })

  // Get brands registered in the last 30 days
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { count: newBrands } = await supabase
    .from("brand_profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", thirtyDaysAgo.toISOString())

  // Get brands by industry
  const { data: brandsByIndustry } = await supabase
    .from("brand_profiles")
    .select("industry")
    .not("industry", "is", null)

  const industryDistribution =
    brandsByIndustry?.reduce(
      (acc, brand) => {
        if (brand.industry) {
          acc[brand.industry] = (acc[brand.industry] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return {
    totalBrands: totalBrands || 0,
    newBrands: newBrands || 0,
    industryDistribution,
  }
}

export async function getSheetStats() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get total sheets count
  const { count: totalSheets } = await supabase.from("influencer_sheets").select("*", { count: "exact", head: true })

  // Get sheets by access type
  const { data: sheetsByAccessType } = await supabase
    .from("influencer_sheets")
    .select("access_type")
    .not("access_type", "is", null)

  const accessTypeDistribution =
    sheetsByAccessType?.reduce(
      (acc, sheet) => {
        if (sheet.access_type) {
          acc[sheet.access_type] = (acc[sheet.access_type] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return {
    totalSheets: totalSheets || 0,
    accessTypeDistribution,
  }
}

export async function getTopAgents(limit = 5) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get agents with the most sheets
  const { data: topAgents } = await supabase
    .from("influencer_sheets")
    .select("agent_id, count")
    .not("agent_id", "is", null)
    .group("agent_id")
    .order("count", { ascending: false })
    .limit(limit)

  // Get agent details
  const agentDetails = await Promise.all(
    (topAgents || []).map(async (agent) => {
      const { data: agentData } = await supabase
        .from("agent_profiles")
        .select("company_name, avatar_url, is_verified")
        .eq("id", agent.agent_id)
        .single()

      return {
        id: agent.agent_id,
        sheetCount: agent.count,
        companyName: agentData?.company_name || "Unknown",
        avatarUrl: agentData?.avatar_url || null,
        isVerified: agentData?.is_verified || false,
      }
    }),
  )

  return agentDetails
}

export async function getPricingStats() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get pricing types distribution
  const { data: pricingByType } = await supabase
    .from("influencer_pricing")
    .select("pricing_type")
    .not("pricing_type", "is", null)

  const pricingTypeDistribution =
    pricingByType?.reduce(
      (acc, pricing) => {
        if (pricing.pricing_type) {
          acc[pricing.pricing_type] = (acc[pricing.pricing_type] || 0) + 1
        }
        return acc
      },
      {} as Record<string, number>,
    ) || {}

  return {
    pricingTypeDistribution,
  }
}

// Add the missing functions

export async function getUserGrowthData() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get user growth by month for the last 12 months
  const endDate = new Date()
  const startDate = new Date()
  startDate.setMonth(startDate.getMonth() - 11) // 12 months including current month

  // Format dates to YYYY-MM
  const formatYearMonth = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
  }

  // Generate all months in the range
  const months: string[] = []
  const currentDate = new Date(startDate)
  while (currentDate <= endDate) {
    months.push(formatYearMonth(currentDate))
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  // Get user registrations by month
  const { data: usersByMonth } = await supabase.rpc("get_user_growth_by_month")

  // Convert to a map for easy lookup
  const userCountByMonth = (usersByMonth || []).reduce(
    (acc, item) => {
      acc[item.month] = item.count
      return acc
    },
    {} as Record<string, number>,
  )

  // Fill in the data for all months
  const growthData = months.map((month) => ({
    month,
    count: userCountByMonth[month] || 0,
  }))

  return growthData
}

export async function getSystemLogs(limit = 100) {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // In a real application, you would have a system_logs table
  // For now, we'll simulate logs using sheet_views and other activity

  // Get recent sheet views
  const { data: sheetViews } = await supabase
    .from("sheet_views")
    .select(`
      id,
      viewed_at,
      ip_address,
      user_agent,
      sheet_id,
      viewer_id,
      users:viewer_id (
        id,
        full_name,
        email
      )
    `)
    .order("viewed_at", { ascending: false })
    .limit(limit)

  // Format the logs
  const logs = (sheetViews || []).map((view) => ({
    id: view.id,
    timestamp: view.viewed_at,
    action: "sheet_view",
    ipAddress: view.ip_address || "unknown",
    userAgent: view.user_agent || "unknown",
    user: view.users
      ? {
          id: view.users.id,
          name: view.users.full_name,
          email: view.users.email,
        }
      : null,
    details: {
      sheetId: view.sheet_id,
    },
  }))

  return logs
}
