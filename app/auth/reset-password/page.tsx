"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { resetPassword } from "@/app/actions/auth"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { CheckCircle2, XCircle } from "lucide-react"
import { isValidRedirectUrl } from "@/lib/utils/auth"

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [isTokenValid, setIsTokenValid] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const router = useRouter()

  // Get the redirect URL from the query parameters
  const redirectTo = searchParams.get("redirectTo") || "/login"

  // Validate the redirect URL for security
  const safeRedirectUrl = isValidRedirectUrl(redirectTo) ? redirectTo : "/login"

  useEffect(() => {
    // Check if token exists
    const token = searchParams.get("token_hash")
    const type = searchParams.get("type")

    if (!token || type !== "recovery") {
      setIsTokenValid(false)
      setError("Invalid or missing reset token. Please request a new password reset link.")
    } else {
      setIsTokenValid(true)
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirm-password") as string

      // Check if passwords match
      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Add token to formData
      formData.append("token_hash", searchParams.get("token_hash") || "")
      formData.append("type", searchParams.get("type") || "")
      formData.append("redirectTo", safeRedirectUrl)

      const result = await resetPassword(formData)

      if (result.success) {
        setIsSuccess(true)
        toast({
          title: "Success",
          description: "Your password has been reset successfully.",
        })

        // Redirect to the specified URL or login page
        const redirectUrl =
          result.redirectTo || `/login?message=Your password has been reset successfully. You can now log in.`

        // Redirect after 3 seconds
        setTimeout(() => {
          router.push(redirectUrl)
        }, 3000)
      } else {
        setError(result.message || "Failed to reset password. Please try again.")
        toast({
          title: "Error",
          description: result.message || "Failed to reset password. Please try again.",
          variant: "destructive",
        })
      }
    } catch (err) {
      console.error("Error resetting password:", err)
      setError("An unexpected error occurred. Please try again.")
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
            <CardDescription>Enter your new password below</CardDescription>
          </CardHeader>
          {!isTokenValid ? (
            <>
              <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
                <div className="rounded-full bg-red-100 p-3">
                  <XCircle className="h-12 w-12 text-red-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-xl">Invalid Reset Link</p>
                  <p className="text-muted-foreground">{error}</p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a href="/forgot-password">Request New Reset Link</a>
                </Button>
              </CardFooter>
            </>
          ) : isSuccess ? (
            <>
              <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle2 className="h-12 w-12 text-green-600" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-medium text-xl">Password Reset Successful</p>
                  <p className="text-muted-foreground">
                    Your password has been reset successfully. You will be redirected to the login page in a few
                    seconds.
                  </p>
                </div>
              </CardContent>
              <CardFooter>
                <Button asChild className="w-full">
                  <a
                    href={`/login${safeRedirectUrl !== "/login" ? `?redirectTo=${encodeURIComponent(safeRedirectUrl)}` : ""}`}
                  >
                    Go to Login
                  </a>
                </Button>
              </CardFooter>
            </>
          ) : (
            <>
              <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">New Password</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm New Password</Label>
                    <Input id="confirm-password" name="confirm-password" type="password" required />
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button className="w-full" type="submit" disabled={isLoading}>
                    {isLoading ? "Resetting Password..." : "Reset Password"}
                  </Button>
                </CardFooter>
              </form>
            </>
          )}
        </Card>
      </main>
      <Toaster />
    </div>
  )
}
