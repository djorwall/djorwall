"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Mail } from "lucide-react"
import Link from "next/link"
import { initOtpless, otplessConfig, type OtplessResponse } from "@/lib/otpless/client"
import { authConfig } from "@/lib/auth/auth-config"

// Declare global function for OTPless callback
declare global {
  interface Window {
    otplessCallback?: (response: OtplessResponse) => void
    handleOtplessSuccess?: (response: OtplessResponse) => void
    handleOtplessError?: (error: string) => void
  }
}

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [userIdentifier, setUserIdentifier] = useState("")
  const [termsAccepted, setTermsAccepted] = useState(false)

  const searchParams = useSearchParams()
  const router = useRouter()

  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // Initialize OTPless SDK
  useEffect(() => {
    initOtpless()

    // Define success callback
    window.handleOtplessSuccess = (response) => {
      if (response.data?.token) {
        if (!termsAccepted) {
          toast({
            title: "Error",
            description: "Please accept the terms of service and privacy policy.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        setIsLoading(true)

        // Get user identifier
        const identifier =
          response.data.email ||
          (response.data.mobile?.number ? `+${response.data.mobile.prefix}${response.data.mobile.number}` : null)

        if (identifier) {
          setUserIdentifier(identifier)
        }

        // Redirect to callback route with token
        const callbackUrl = `/auth/otpless/callback?token=${response.data.token}&redirectTo=${encodeURIComponent(redirectTo)}`
        router.push(callbackUrl)
      } else {
        toast({
          title: "Error",
          description: "Failed to authenticate. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    // Define error callback
    window.handleOtplessError = (error) => {
      toast({
        title: "Error",
        description: error || "Authentication failed. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }

    // Define main callback
    window.otplessCallback = (response) => {
      if (response.data) {
        if (window.handleOtplessSuccess) {
          window.handleOtplessSuccess(response)
        }
      } else if (response.error) {
        if (window.handleOtplessError) {
          window.handleOtplessError(response.error)
        }
      }
    }

    return () => {
      // Clean up callbacks
      delete window.otplessCallback
      delete window.handleOtplessSuccess
      delete window.handleOtplessError
    }
  }, [router, redirectTo, termsAccepted])

  // Handle OTPless signup
  const handleOtplessSignup = () => {
    if (!termsAccepted) {
      toast({
        title: "Error",
        description: "Please accept the terms of service and privacy policy.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Check if OTPless SDK is loaded
    if (typeof window.otpless !== "function") {
      toast({
        title: "Error",
        description: "OTPless SDK not loaded. Please refresh the page and try again.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      // Call OTPless SDK
      window.otpless({
        method: otplessConfig.methods,
        callback: otplessConfig.callbackName,
      })
    } catch (error) {
      console.error("Error initializing OTPless:", error)
      toast({
        title: "Error",
        description: "Failed to initialize authentication. Please try again.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  // Handle signup
  const handleSignup = () => {
    setIsLoading(true)

    // Simulate signup process
    setTimeout(() => {
      toast({
        title: "Success",
        description: "Your account has been created successfully.",
      })

      // Redirect to the specified URL
      router.push(redirectTo)
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        {isSuccess ? (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Check your inbox</CardTitle>
              <CardDescription>Verification email sent</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="rounded-full bg-primary/10 p-6">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">We've sent a verification email to:</p>
                <p className="font-bold">{userIdentifier}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Please check your email and click on the verification link to complete your registration.
                </p>
              </div>
              <div className="text-center text-sm text-muted-foreground">
                <p>Didn't receive an email? Check your spam folder or</p>
                <Button variant="link" className="p-0 h-auto" onClick={() => setIsSuccess(false)}>
                  try signing up again
                </Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button asChild className="w-full">
                <Link
                  href={`/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                >
                  Go to Login
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
              <CardDescription>
                {authConfig.enabled
                  ? "Create an account to get started"
                  : "Authentication is currently disabled for testing"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!authConfig.enabled && (
                <div
                  className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded relative"
                  role="alert"
                >
                  <strong className="font-bold">Testing Mode: </strong>
                  <span className="block sm:inline">
                    Authentication is disabled. Click the button below to simulate signup.
                  </span>
                </div>
              )}

              <Button
                onClick={authConfig.enabled ? handleOtplessSignup : handleSignup}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <span className="flex items-center justify-center">
                    <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M3.9 12C3.9 10.29 5.29 8.9 7 8.9H11V7H7C4.24 7 2 9.24 2 12C2 14.76 4.24 17 7 17H11V15.1H7C5.29 15.1 3.9 13.71 3.9 12ZM8 13H16V11H8V13ZM17 7H13V8.9H17C18.71 8.9 20.1 10.29 20.1 12C20.1 13.71 18.71 15.1 17 15.1H13V17H17C19.76 17 22 14.76 22 12C22 9.24 19.76 7 17 7Z"
                        fill="currentColor"
                      />
                    </svg>
                    {authConfig.enabled ? "Sign up with OTPless" : "Sign Up"}
                  </span>
                )}
              </Button>

              {authConfig.enabled && (
                <div className="text-center text-sm text-muted-foreground">
                  <p>Sign up securely with WhatsApp, Email, or SMS</p>
                  <p className="mt-1">No passwords or OTPs required</p>
                </div>
              )}

              {authConfig.enabled && (
                <div className="flex items-center space-x-2 mt-4">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the{" "}
                    <Link href="/terms" className="text-primary hover:underline">
                      terms of service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="text-primary hover:underline">
                      privacy policy
                    </Link>
                  </Label>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link
                  href={`/login${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
                  className="text-primary hover:underline"
                >
                  Login
                </Link>
              </div>
            </CardFooter>
          </Card>
        )}
      </main>
      <Toaster />
    </div>
  )
}
