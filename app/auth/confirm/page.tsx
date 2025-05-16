"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { EmailOtpType } from "@supabase/supabase-js"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"

export default function ConfirmPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const supabase = createClientComponentClient()

        const token_hash = searchParams.get("token_hash")
        const type = searchParams.get("type") as EmailOtpType

        if (!token_hash || !type) {
          setError("Invalid confirmation link. Please request a new one.")
          setIsLoading(false)
          return
        }

        const { error } = await supabase.auth.verifyOtp({
          token_hash,
          type,
        })

        if (error) {
          setError(error.message)
        } else {
          setSuccess(true)
          // Redirect to login page after 3 seconds
          setTimeout(() => {
            router.push("/login?message=Your email has been confirmed. You can now log in.")
          }, 3000)
        }
      } catch (err) {
        console.error("Error confirming email:", err)
        setError("An unexpected error occurred. Please try again.")
      } finally {
        setIsLoading(false)
      }
    }

    confirmEmail()
  }, [searchParams, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB] p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
          <CardDescription>Verifying your email address</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-6">
          {isLoading ? (
            <div className="flex flex-col items-center gap-4">
              <Loader2 className="h-12 w-12 text-primary animate-spin" />
              <p className="text-center text-muted-foreground">Verifying your email address...</p>
            </div>
          ) : success ? (
            <div className="flex flex-col items-center gap-4">
              <CheckCircle2 className="h-12 w-12 text-green-500" />
              <div className="text-center space-y-2">
                <p className="font-medium text-lg">Email confirmed successfully!</p>
                <p className="text-muted-foreground">Redirecting you to the login page...</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <XCircle className="h-12 w-12 text-destructive" />
              <div className="text-center space-y-2">
                <p className="font-medium text-lg">Confirmation failed</p>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button onClick={() => router.push("/signup")} className="mt-4">
                Back to Sign Up
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
