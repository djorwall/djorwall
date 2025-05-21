"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { CheckCircle2, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const searchParams = useSearchParams()
  const router = useRouter()

  const message = searchParams.get("message")
  const error = searchParams.get("error")
  const redirectTo = searchParams.get("redirectTo") || "/dashboard"

  // Show toast messages for success/error
  useEffect(() => {
    if (message) {
      toast({
        title: "Success",
        description: message,
      })
    }

    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      })
    }
  }, [message, error])

  // Handle OTPless login
  const handleOtplessLogin = () => {
    setIsLoading(true)

    // For now, just simulate a loading state and then redirect to dashboard
    // This will be replaced with actual OTPless integration
    setTimeout(() => {
      router.push("/dashboard")
    }, 1500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h1 className="text-2xl font-bold mb-6 text-center">Login Page</h1>
          <p className="text-center text-gray-600">This is a minimal login page.</p>

          {message && (
            <div className="mb-4 border-green-200 bg-green-50 text-green-800 flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4 mr-2" />
              <span>{message}</span>
            </div>
          )}

          {error && (
            <div className="mb-4 border-red-200 bg-red-50 text-red-800 flex items-center justify-center">
              <AlertCircle className="h-4 w-4 mr-2" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-6">
            <Button
              onClick={handleOtplessLogin}
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
                  Continue with OTPless
                </span>
              )}
            </Button>

            <div className="text-center text-sm text-gray-600 mt-4">
              Login securely with WhatsApp, Email, or SMS
              <br />
              No passwords or OTPs required
            </div>
          </div>

          <div className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link
              href={`/signup${redirectTo !== "/dashboard" ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`}
              className="text-blue-500 hover:underline"
            >
              Sign up
            </Link>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}
