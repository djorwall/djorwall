import { OtplessLogin } from "@/components/otpless-login"
import { checkUserAuthenticated } from "@/lib/supabase/auth"
import { redirect } from "next/navigation"

export default async function LoginPage() {
  // Check if user is already authenticated
  const isAuthenticated = await checkUserAuthenticated()

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <h1 className="text-3xl font-bold mb-8 text-center">Welcome Back</h1>
        <OtplessLogin />
      </div>
    </div>
  )
}
