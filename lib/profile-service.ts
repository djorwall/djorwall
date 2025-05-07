import { getSupabaseBrowser } from "./supabase"

export type AgentProfileData = {
  userId: string
  companyName?: string
  bio?: string
  location?: string
  website?: string
  phone?: string
  avatarUrl?: string
  coverImageUrl?: string
}

export type PastWorkData = {
  id?: string
  agentId: string
  title: string
  description?: string
  imageUrl?: string
}

export const updateAgentProfile = async (profileData: AgentProfileData): Promise<{ profile: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: profile, error } = await supabase
    .from("agent_profiles")
    .update({
      company_name: profileData.companyName,
      bio: profileData.bio,
      location: profileData.location,
      website: profileData.website,
      phone: profileData.phone,
      avatar_url: profileData.avatarUrl,
      cover_image_url: profileData.coverImageUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", profileData.userId)
    .select()
    .single()

  return { profile, error }
}

export const getAgentProfile = async (userId: string): Promise<{ profile: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: profile, error } = await supabase
    .from("agent_profiles")
    .select(`
      *,
      users!agent_profiles_user_id_fkey(
        full_name,
        email
      )
    `)
    .eq("user_id", userId)
    .single()

  if (error || !profile) {
    return { profile: null, error }
  }

  // Get past work
  const { data: pastWork, error: pastWorkError } = await supabase
    .from("past_work")
    .select("*")
    .eq("agent_id", userId)
    .order("created_at", { ascending: false })

  if (pastWorkError) {
    return { profile, error: pastWorkError }
  }

  // Get reviews
  const { data: reviews, error: reviewsError } = await supabase
    .from("reviews")
    .select(`
      *,
      users!reviews_brand_id_fkey(
        full_name,
        brand_profiles(brand_name)
      )
    `)
    .eq("agent_id", userId)
    .order("created_at", { ascending: false })

  if (reviewsError) {
    return { profile, error: reviewsError }
  }

  // Format the profile data
  const formattedProfile = {
    ...profile,
    name: profile.users.full_name,
    email: profile.users.email,
    users: undefined,
    pastWork,
    reviews: reviews.map((review: any) => ({
      ...review,
      brandName: review.users.brand_profiles[0]?.brand_name || review.users.full_name,
      users: undefined,
    })),
  }

  return { profile: formattedProfile, error: null }
}

export const addPastWork = async (workData: PastWorkData): Promise<{ work: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: work, error } = await supabase
    .from("past_work")
    .insert({
      agent_id: workData.agentId,
      title: workData.title,
      description: workData.description,
      image_url: workData.imageUrl,
    })
    .select()
    .single()

  return { work, error }
}

export const getVerifiedAgents = async (): Promise<{ agents: any[]; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: agents, error } = await supabase
    .from("agent_profiles")
    .select(`
      *,
      users!agent_profiles_user_id_fkey(
        id,
        full_name,
        email
      )
    `)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })

  if (error) {
    return { agents: [], error }
  }

  // Format the agents data
  const formattedAgents = agents.map((agent: any) => ({
    ...agent,
    id: agent.users.id,
    name: agent.users.full_name,
    email: agent.users.email,
    users: undefined,
  }))

  return { agents: formattedAgents, error: null }
}

export const reviewAgent = async (
  agentId: string,
  brandId: string,
  rating: number,
  comment: string,
): Promise<{ review: any; error: any }> => {
  const supabase = getSupabaseBrowser()

  const { data: review, error } = await supabase
    .from("reviews")
    .insert({
      agent_id: agentId,
      brand_id: brandId,
      rating,
      comment,
    })
    .select()
    .single()

  return { review, error }
}
