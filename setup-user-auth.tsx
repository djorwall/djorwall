"use client"

import { useState } from "react"
import { createClientClient } from "@/utils/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"

export default function SetupUserAuth() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [verifyResult, setVerifyResult] = useState<{
    success: boolean
    message: string
    details?: string
  } | null>(null)

  const supabase = createClientClient()

  const createAuthUser = async () => {
    setIsLoading(true)
    setResult(null)

    try {
      // Create user in Supabase Auth
      const { data, error } = await supabase.auth.admin.createUser({
        email: "dheeraj.jorwal@gmail.com",
        password: "papatata@",
        email_confirm: true, // Auto-confirm the email
      })

      if (error) {
        throw error
      }

      setResult({
        success: true,
        message: "User created successfully in Supabase Auth",
        details: `User ID: ${data.user.id}`,
      })
    } catch (error: any) {
      console.error("Error creating user:", error)

      // Check if it's a duplicate user error
      if (error.message?.includes("already exists")) {
        setResult({
          success: false,
          message: "User already exists in Supabase Auth",
          details: "You can still verify login credentials below",
        })
      } else {
        setResult({
          success: false,
          message: "Failed to create user in Supabase Auth",
          details: error.message || "Unknown error",
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  const verifyLogin = async () => {
    setVerifyLoading(true)
    setVerifyResult(null)

    try {
      // Try to sign in with the credentials
      const { data, error } = await supabase.auth.signInWithPassword({
        email: "dheeraj.jorwal@gmail.com",
        password: "papatata@",
      })

      if (error) {
        throw error
      }

      // Sign out immediately after successful verification
      await supabase.auth.signOut()

      setVerifyResult({
        success: true,
        message: "Authentication successful",
        details: "User can log in with the provided credentials",
      })
    } catch (error: any) {
      console.error("Error verifying login:", error)
      setVerifyResult({
        success: false,
        message: "Authentication failed",
        details: error.message || "Unknown error",
      })
    } finally {
      setVerifyLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10 max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>Supabase Auth Setup</CardTitle>
          <CardDescription>Set up authentication for dheeraj.jorwal@gmail.com</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {result.message}
                {result.details && <p className="text-xs mt-1 opacity-80">{result.details}</p>}
              </AlertDescription>
            </Alert>
          )}

          <Button onClick={createAuthUser} disabled={isLoading} className="w-full">
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLoading ? "Creating User..." : "Create User in Supabase Auth"}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">Verification</span>
            </div>
          </div>

          {verifyResult && (
            <Alert variant={verifyResult.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {verifyResult.success ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                <AlertTitle>{verifyResult.success ? "Success" : "Error"}</AlertTitle>
              </div>
              <AlertDescription className="mt-2">
                {verifyResult.message}
                {verifyResult.details && <p className="text-xs mt-1 opacity-80">{verifyResult.details}</p>}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={verifyLogin} disabled={verifyLoading} className="w-full" variant="outline">
            {verifyLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {verifyLoading ? "Verifying..." : "Verify Login Credentials"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
