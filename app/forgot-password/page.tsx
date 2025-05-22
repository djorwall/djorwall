import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Forgot Password | Appopener.io",
  description: "Reset your Appopener.io password",
}

export default function ForgotPasswordPage() {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Forgot Password</h1>
          <p className="text-gray-500 text-center mb-8">Enter your email to receive password reset instructions</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  )
}
