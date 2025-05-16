"use client"

import type React from "react"

import { signUp } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Navbar } from "@/components/navbar"
import { Mail } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import { GoogleButton } from "@/components/auth/google-button"

export default function SignupPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [email, setEmail] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const formData = new FormData(e.currentTarget)
      const emailValue = formData.get("email") as string
      setEmail(emailValue)

      // Check if passwords match
      const password = formData.get("password") as string
      const confirmPassword = formData.get("confirm-password") as string

      if (password !== confirmPassword) {
        toast({
          title: "Error",
          description: "Passwords do not match",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      const result = await signUp(formData)

      if (result.success) {
        setIsSuccess(true)
        toast({
          title: "Success",
          description: "Account created successfully. Please check your email for verification.",
        })

        // Reset the form
        e.currentTarget.reset()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create account. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error signing up:", error)
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
        {isSuccess ? (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Check your email</CardTitle>
              <CardDescription>Verification email sent</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center py-6 space-y-6">
              <div className="rounded-full bg-primary/10 p-6">
                <Mail className="h-12 w-12 text-primary" />
              </div>
              <div className="text-center space-y-2">
                <p className="font-medium">We've sent a verification email to:</p>
                <p className="font-bold">{email}</p>
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
                <Link href="/login">Go to Login</Link>
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Card className="w-full max-w-md">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
              <CardDescription>Enter your information to create an account</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <GoogleButton />

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first-name">First name</Label>
                    <Input id="first-name" name="first-name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last-name">Last name</Label>
                    <Input id="last-name" name="last-name" required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" name="email" type="email" placeholder="m@example.com" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" name="password" type="password" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm password</Label>
                  <Input id="confirm-password" name="confirm-password" type="password" required />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="terms" name="terms" required />
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
                <Button className="w-full" type="submit" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Create account"}
                </Button>
              </form>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="text-primary hover:underline">
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
