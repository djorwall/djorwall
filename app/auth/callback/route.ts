import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import type { Database } from "@/lib/supabase/database.types"
import { getSafeRedirectUrl, authConfig } from "@/lib/supabase/auth"

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  // Get the intended redirect URL from the state parameter or default to dashboard
  const stateParam = requestUrl.searchParams.get("state")
  let redirectTo = authConfig.defaultRedirectUrl

  // Try to parse the state parameter if it exists
  if (stateParam) {
    try {
      const stateObj = JSON.parse(decodeURIComponent(stateParam))
      if (stateObj.redirectTo) {
        redirectTo = getSafeRedirectUrl(stateObj.redirectTo)
      }
    } catch (error) {
      console.error("Error parsing state parameter:", error)
    }
  }

  if (code) {
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient<Database>({ cookies: () => cookieStore })

    // Exchange the code for a session
    await supabase.auth.exchangeCodeForSession(code)

    // Check if the user has a profile, if not create one
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (user) {
      // Check if user has a profile
      const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

      // If no profile exists, create one
      if (!profile) {
        const fullName =
          user.user_metadata.full_name ||
          `${user.user_metadata.given_name || ""} ${user.user_metadata.family_name || ""}`.trim() ||
          user.email?.split("@")[0] ||
          "User"

        await supabase.from("profiles").insert({
          id: user.id,
          full_name: fullName,
          avatar_url: user.user_metadata.avatar_url,
        })
      }

      // Check if there's a redirect URL in the user metadata
      if (user.user_metadata.redirect_to && !stateParam) {
        redirectTo = getSafeRedirectUrl(user.user_metadata.redirect_to)
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(new URL(redirectTo, request.url))
}
