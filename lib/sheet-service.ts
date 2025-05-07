import { getSupabaseBrowser } from "./supabase"

export type InfluencerSheetData = {
  id?: string
  name: string
  description?: string
  accessType: "public" | "password" | "request" | "one-time"
  password?: string
  categories: string[]
}

export type InfluencerData = {
  id?: string
  sheetId: string
  name: string
  handle: string
  platform: "Instagram" | "TikTok" | "YouTube" | "Twitter" | "Other"
  followers: string
  category: string
  imageUrl?: string
  engagement?: string
  pricing: {
    type: string
    price: string
  }[]
}

export const createSheet = async (
  agentId: string,
  sheetData: InfluencerSheetData,
): Promise<{ sheet: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  // Insert the sheet
  const { data: sheet, error: sheetError } = await supabase
    .from("influencer_sheets")
    .insert({
      agent_id: agentId,
      name: sheetData.name,
      description: sheetData.description || "",
      access_type: sheetData.accessType,
      password: sheetData.accessType === "password" ? sheetData.password : null,
      is_published: true,
    })
    .select()
    .single()

  if (sheetError || !sheet) {
    return { sheet: null, error: sheetError }
  }

  // Insert categories
  if (sheetData.categories && sheetData.categories.length > 0) {
    const categoryInserts = sheetData.categories.map((category) => ({
      sheet_id: sheet.id,
      category,
    }))

    const { error: categoryError } = await supabase.from("sheet_categories").insert(categoryInserts)

    if (categoryError) {
      return { sheet, error: categoryError }
    }
  }

  return { sheet, error: null }
}

export const getSheetsByAgent = async (agentId: string): Promise<{ sheets: any[]; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: sheets, error } = await supabase
    .from("influencer_sheets")
    .select(`
      *,
      sheet_categories(category)
    `)
    .eq("agent_id", agentId)
    .order("created_at", { ascending: false })

  if (error) {
    return { sheets: [], error }
  }

  // Format the sheets to include categories as an array
  const formattedSheets = sheets.map((sheet) => ({
    ...sheet,
    categories: sheet.sheet_categories.map((cat: any) => cat.category),
    sheet_categories: undefined,
  }))

  return { sheets: formattedSheets, error: null }
}

export const getSheetById = async (sheetId: string): Promise<{ sheet: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: sheet, error: sheetError } = await supabase
    .from("influencer_sheets")
    .select(`
      *,
      sheet_categories(category),
      users!influencer_sheets_agent_id_fkey(
        full_name,
        email,
        agent_profiles(*)
      )
    `)
    .eq("id", sheetId)
    .single()

  if (sheetError || !sheet) {
    return { sheet: null, error: sheetError }
  }

  // Get influencers for this sheet
  const { data: influencers, error: influencersError } = await supabase
    .from("influencers")
    .select(`
      *,
      influencer_pricing(*)
    `)
    .eq("sheet_id", sheetId)

  if (influencersError) {
    return { sheet, error: influencersError }
  }

  // Format the sheet data
  const formattedSheet = {
    ...sheet,
    categories: sheet.sheet_categories.map((cat: any) => cat.category),
    sheet_categories: undefined,
    agent: {
      id: sheet.agent_id,
      name: sheet.users.full_name,
      email: sheet.users.email,
      ...(sheet.users.agent_profiles[0] || {}),
    },
    users: undefined,
    influencers: influencers.map((inf: any) => ({
      ...inf,
      pricing: inf.influencer_pricing.reduce((acc: any, pricing: any) => {
        acc[pricing.pricing_type] = pricing.price
        return acc
      }, {}),
      influencer_pricing: undefined,
    })),
  }

  return { sheet: formattedSheet, error: null }
}

export const addInfluencerToSheet = async (
  influencerData: InfluencerData,
): Promise<{ influencer: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  // Insert the influencer
  const { data: influencer, error: influencerError } = await supabase
    .from("influencers")
    .insert({
      sheet_id: influencerData.sheetId,
      name: influencerData.name,
      handle: influencerData.handle,
      platform: influencerData.platform,
      followers: influencerData.followers,
      category: influencerData.category,
      image_url: influencerData.imageUrl,
      engagement: influencerData.engagement,
    })
    .select()
    .single()

  if (influencerError || !influencer) {
    return { influencer: null, error: influencerError }
  }

  // Insert pricing
  if (influencerData.pricing && influencerData.pricing.length > 0) {
    const pricingInserts = influencerData.pricing.map((pricing) => ({
      influencer_id: influencer.id,
      pricing_type: pricing.type,
      price: pricing.price,
    }))

    const { error: pricingError } = await supabase.from("influencer_pricing").insert(pricingInserts)

    if (pricingError) {
      return { influencer, error: pricingError }
    }
  }

  return { influencer, error: null }
}

export const trackSheetView = async (
  sheetId: string,
  viewerId?: string,
  ipAddress?: string,
  userAgent?: string,
): Promise<{ error: any }> => {
  const supabase = getSupabaseBrowser()

  const { error } = await supabase.from("sheet_views").insert({
    sheet_id: sheetId,
    viewer_id: viewerId || null,
    ip_address: ipAddress,
    user_agent: userAgent,
  })

  return { error }
}

export const getSheetViews = async (sheetId: string): Promise<{ views: any[]; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: views, error } = await supabase
    .from("sheet_views")
    .select(`
      *,
      users(full_name, email)
    `)
    .eq("sheet_id", sheetId)
    .order("viewed_at", { ascending: false })

  if (error) {
    return { views: [], error }
  }

  return { views, error: null }
}

export const requestSheetAccess = async (sheetId: string, brandId: string): Promise<{ request: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: request, error } = await supabase
    .from("sheet_access_requests")
    .insert({
      sheet_id: sheetId,
      brand_id: brandId,
      status: "pending",
    })
    .select()
    .single()

  return { request, error }
}

export const updateAccessRequest = async (
  requestId: string,
  status: "approved" | "rejected",
): Promise<{ error: any }> => {
  const supabase = getSupabaseBrowser()

  const { error } = await supabase
    .from("sheet_access_requests")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", requestId)

  return { error }
}
