"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/contexts/auth-context"
import { Github, Twitter } from "lucide-react"

export function SocialLogin() {
  const { signInWithProvider } = useAuth()

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-2 text-gray-500">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          type="button"
          onClick={() => signInWithProvider("github")}
          className="flex items-center justify-center gap-2"
        >
          <Github className="h-4 w-4" />
          GitHub
        </Button>
        <Button
          variant="outline"
          type="button"
          onClick={() => signInWithProvider("twitter")}
          className="flex items-center justify-center gap-2"
        >
          <Twitter className="h-4 w-4" />
          Twitter
        </Button>
      </div>
    </div>
  )
}
