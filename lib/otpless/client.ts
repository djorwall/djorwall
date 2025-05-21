"use client"

// OTPless client configuration
export const OTPLESS_CLIENT_ID = process.env.NEXT_PUBLIC_OTPLESS_CLIENT_ID || ""
export const OTPLESS_REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/auth/otpless/callback`

// OTPless SDK script URL
export const OTPLESS_SDK_URL = "https://otpless.com/auth.js"

// Function to initialize OTPless SDK
export function initOtpless() {
  // Check if the script is already loaded
  if (document.getElementById("otpless-sdk")) {
    return
  }

  // Create script element
  const script = document.createElement("script")
  script.id = "otpless-sdk"
  script.src = OTPLESS_SDK_URL
  script.async = true

  // Append script to document
  document.head.appendChild(script)
}

// Types for OTPless response
export interface OtplessUserData {
  token: string
  timestamp: number
  mobile?: {
    number: string
    prefix: string
  }
  email?: string
  name?: string
  waName?: string
}

export interface OtplessResponse {
  data?: OtplessUserData
  error?: string
}

// Helper to extract user identifier from OTPless response
export function getUserIdentifierFromOtplessData(data: OtplessUserData): string | null {
  return data.email || (data.mobile?.number ? `+${data.mobile.prefix}${data.mobile.number}` : null)
}

// Helper to extract user name from OTPless response
export function getUserNameFromOtplessData(data: OtplessUserData): string {
  return data.name || data.waName || "OTPless User"
}
