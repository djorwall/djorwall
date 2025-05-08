import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  const requestData = await request.json()
  const { email, password, fullName, role, companyName, brandName } = requestData

  // Create a Supabase client with the service role
  const supabase = createRouteHandlerClient({ cookies })

  try {
    // 1. Create the user in auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          role,
        },
      },
    })

    if (authError || !authData.user) {
      return NextResponse.json({ error: authError?.message || "Failed to create user" }, { status: 400 })
    }

    // 2. Insert the user into our users table
    const { error: userError } = await supabase.from("users").insert({
      id: authData.user.id,
      email,
      password: "", // We don't store the actual password, just a placeholder
      full_name: fullName,
      role,
    })

    if (userError) {
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    // 3. Create profile based on role
    if (role === "agent" && companyName) {
      const { error: profileError } = await supabase.from("agent_profiles").insert({
        user_id: authData.user.id,
        company_name: companyName,
      })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    } else if (role === "brand" && brandName) {
      const { error: profileError } = await supabase.from("brand_profiles").insert({
        user_id: authData.user.id,
        brand_name: brandName,
      })

      if (profileError) {
        return NextResponse.json({ error: profileError.message }, { status: 400 })
      }
    }

    // 4. Return the user data
    return NextResponse.json({ user: authData.user })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
