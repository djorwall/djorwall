"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Navbar } from "@/components/navbar"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"
import type { Database } from "@/lib/supabase/database.types"
import { isValidRedirectUrl } from "@/lib/utils/auth"

export default function ConfirmPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const supabase = createClientComponentClient<Database>()

        // Get the token hash and type from the URL
        const tokenHash = searchParams.get("token_hash")
        const type = searchParams.get("type")

        if (!tokenHash || type !== "signup") {
          setError("Invalid confirmation link. Please request a new one.")
          setIsLoading(false)
          return
        }

        // Verify the email
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: "signup",
        })

        if (error) {
          setError(error.message)
        } else {
          setIsConfirmed(true)

          // Get the user to check for a redirect URL in metadata
          const {
            data: { user },
          } = await supabase.auth.getUser()

          // Check if there's a redirect URL in the user metadata
          let redirectTo = "/login?message=Your email has been confirmed. You can now log in."

          if (user?.user_metadata?.redirect_to) {
            const safeRedirectUrl = isValidRedirectUrl(user.user_metadata.redirect_to)
              ? user.user_metadata.redirect_to
              : "/dashboard"

            // Add the redirect URL to the login page
            redirectTo = `/login?message=Your email has been confirmed. You can now log in.&redirectTo=${encodeURIComponent(safeRedirectUrl)}`
          }

          // Redirect after 3 seconds
          setTimeout(() => {
            router.push(redirectTo)
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
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Email Confirmation</CardTitle>
            <CardDescription>Verifying your email address</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
            {isLoading ? (
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-center text-muted-foreground">Verifying your email address...</p>
              </div>
            ) : isConfirmed ? (
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-xl">Email confirmed successfully!</p>
                  <p className="text-muted-foreground">
                    Your email has been confirmed. You will be redirected to the login page in a few seconds.
                  </p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-xl">Confirmation failed</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/login">Go to Login</a>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  )
}
