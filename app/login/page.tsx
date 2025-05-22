import { LoginForm } from "@/components/auth/login-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Appopener.io",
  description: "Login to your Appopener.io account",
}

export default function LoginPage() {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Welcome Back</h1>
          <p className="text-gray-500 text-center mb-8">Sign in to your account to continue</p>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
