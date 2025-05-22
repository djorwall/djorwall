import { SignupForm } from "@/components/auth/signup-form"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Sign Up | Appopener.io",
  description: "Create a new Appopener.io account",
}

export default function SignupPage() {
  return (
    <div className="container max-w-screen-xl py-12">
      <div className="flex flex-col items-center justify-center">
        <div className="w-full max-w-md">
          <h1 className="text-3xl font-bold text-center mb-6">Create an Account</h1>
          <p className="text-gray-500 text-center mb-8">Join Appopener.io to create smart deeplinks</p>
          <SignupForm />
        </div>
      </div>
    </div>
  )
}
