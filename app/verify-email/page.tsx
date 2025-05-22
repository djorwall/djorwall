"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { createBrowserSupabaseClient } from "@/lib/supabase"

export default function VerifyEmailPage() {
  const [isVerifying, setIsVerifying] = useState(true)
  const [isSuccess, setIsSuccess] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()

  // Get the hash from the URL
  const hash = searchParams?.get("hash")
  const type = searchParams?.get("type")

  useEffect(() => {
    const verifyEmail = async () => {
      if (!hash || type !== "signup") {
        setIsVerifying(false)
        return
      }

      try {
        const supabase = createBrowserSupabaseClient()
        const { error } = await supabase.auth.verifyOtp({
          type: "signup",
          token_hash: hash,
        })

        if (error) {
          toast({
            title: "Verification failed",
            description: error.message,
            variant: "destructive",
          })
          setIsVerifying(false)
          return
        }

        // Update the user profile to mark email as verified
        const { data: userData } = await supabase.auth.getUser()
        if (userData.user) {
          await supabase.from("user_profiles").update({ is_email_verified: true }).eq("id", userData.user.id)
        }

        setIsSuccess(true)
        setIsVerifying(false)
        toast({
          title: "Email verified",
          description: "Your email has been verified successfully.",
        })
      } catch (error) {
        console.error("Email verification error:", error)
        toast({
          title: "Verification failed",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        })
        setIsVerifying(false)
      }
    }

    verifyEmail()
  }, [hash, type, toast])

  return (
    <div className="container max-w-screen-xl py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <Card className="w-full">
            <CardHeader>
              <CardTitle>Email Verification</CardTitle>
              <CardDescription>Verifying your email address</CardDescription>
            </CardHeader>
            <CardContent>
              {isVerifying ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Verifying your email address...</p>
                </div>
              ) : isSuccess ? (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-green-600"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-gray-700">Your email has been verified successfully.</p>
                  <p className="text-sm text-gray-500">You can now log in to your account.</p>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mx-auto">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="w-6 h-6 text-red-600"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <p className="text-gray-700">The verification link is invalid or has expired.</p>
                  <p className="text-sm text-gray-500">Please try again or request a new verification email.</p>
                </div>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => router.push("/login")}>Go to Login</Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
