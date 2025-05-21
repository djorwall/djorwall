import { type NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/auth"

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json({ success: false, message: "Token is required" }, { status: 400 })
    }

    // Verify the token with OTPless API
    const otplessResponse = await fetch("https://api.otpless.app/api/v1/user/verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        clientid: process.env.OTPLESS_CLIENT_ID || "",
        clientsecret: process.env.OTPLESS_CLIENT_SECRET || "",
      },
      body: JSON.stringify({ token }),
    })

    const otplessData = await otplessResponse.json()

    if (!otplessData.success) {
      console.error("OTPless verification failed:", otplessData)
      return NextResponse.json({ success: false, message: "Failed to verify token" }, { status: 401 })
    }

    // Extract user data
    const userData = otplessData.data.user

    if (!userData) {
      return NextResponse.json({ success: false, message: "No user data found" }, { status: 400 })
    }

    // Get user identifier (email or phone)
    const userIdentifier = userData.email || userData.phoneNumber

    if (!userIdentifier) {
      return NextResponse.json({ success: false, message: "No email or phone number found" }, { status: 400 })
    }

    // Create or get user in Supabase
    const supabase = createServiceClient()

    // Check if user exists
    const { data: existingUser } = await supabase.auth.admin.getUserByEmail(
      userData.email || `${userData.phoneNumber}@otpless.user`,
    )

    let userId

    if (existingUser?.user) {
      // User exists, sign them in
      userId = existingUser.user.id
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email: userData.email || `${userData.phoneNumber}@otpless.user`,
        email_confirm: true,
        password: process.env.OTPLESS_USER_PASSWORD || Math.random().toString(36).slice(2),
        user_metadata: {
          full_name: userData.name || "OTPless User",
          phone: userData.phoneNumber,
          provider: "otpless",
        },
      })

      if (createError) {
        console.error("Error creating user:", createError)
        return NextResponse.json({ success: false, message: "Failed to create user" }, { status: 500 })
      }

      userId = newUser.user.id

      // Create user profile
      await supabase.from("profiles").insert({
        id: userId,
        full_name: userData.name || "OTPless User",
        phone: userData.phoneNumber,
      })
    }

    // Create session for the user
    const { data: sessionData, error: sessionError } = await supabase.auth.admin.createSession({
      user_id: userId,
      expires_in: 60 * 60 * 24 * 7, // 1 week
    })

    if (sessionError) {
      console.error("Error creating session:", sessionError)
      return NextResponse.json({ success: false, message: "Failed to create session" }, { status: 500 })
    }

    // Set cookies
    const response = NextResponse.json({ success: true })

    response.cookies.set("sb-access-token", sessionData.session.access_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    response.cookies.set("sb-refresh-token", sessionData.session.refresh_token, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 1 week
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    })

    return response
  } catch (error) {
    console.error("OTPless callback error:", error)
    return NextResponse.json({ success: false, message: "An unexpected error occurred" }, { status: 500 })
  }
}
