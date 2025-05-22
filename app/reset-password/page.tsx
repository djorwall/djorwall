import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Reset Password | Appopener.io",
  description: "Set a new password for your Appopener.io account",
}

export default function ResetPasswordPage() {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Reset Password</h1>
          <p className="text-gray-500 text-center mb-8">Create a new password for your account</p>
          <ResetPasswordForm />
        </div>
      </div>
    </div>
  )
}
