"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

declare global {
  interface Window {
    otpless: (otplessUser: (user: any) => void) => void
  }
}

export function OtplessLogin() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Load OTPless script
    const script = document.createElement("script")
    script.src = "https://otpless.com/auth.js"
    script.async = true
    document.body.appendChild(script)

    // Define the callback function
    window.otpless = async (otplessUser) => {
      try {
        setIsLoading(true)
        setError(null)

        otplessUser(async (response: any) => {
          if (response.data && response.data.token) {
            // Call your backend to verify and sign in the user
            const result = await fetch("/auth/otpless/callback", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ token: response.data.token }),
            })

            const data = await result.json()

            if (data.success) {
              // Redirect to dashboard on successful login
              router.push("/dashboard")
            } else {
              setError(data.message || "Authentication failed")
            }
          } else {
            setError("Authentication failed. Please try again.")
          }
          setIsLoading(false)
        })
      } catch (err) {
        console.error("OTPless login error:", err)
        setError("An unexpected error occurred. Please try again.")
        setIsLoading(false)
      }
    }

    return () => {
      // Clean up
      document.body.removeChild(script)
      delete window.otpless
    }
  }, [router])

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Sign In</CardTitle>
        <CardDescription>Sign in to your account using OTPless</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="lg" />
          </div>
        ) : (
          <>
            {error && <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">{error}</div>}
            <div id="otpless-login-page" className="flex justify-center">
              {/* OTPless will render the login button here */}
            </div>
          </>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <p className="text-sm text-gray-500">By signing in, you agree to our Terms of Service and Privacy Policy</p>
      </CardFooter>
    </Card>
  )
}
