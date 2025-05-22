"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Clipboard, Check } from "lucide-react"
import { SimpleCaptcha } from "@/components/simple-captcha"
import { generateDeepLinkAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"

export function LinkGenerator() {
  const [url, setUrl] = useState("")
  const [shortLink, setShortLink] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [isCopied, setIsCopied] = useState(false)
  const [captchaVerified, setCaptchaVerified] = useState(false)
  const [showCaptcha, setShowCaptcha] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsGenerating(true)

    // Only show captcha for non-authenticated users
    if (!user && !showCaptcha) {
      setShowCaptcha(true)
      setIsGenerating(false)
      return
    }

    // Only require captcha verification for non-authenticated users
    if (!user && !captchaVerified) {
      setIsGenerating(false)
      return
    }

    try {
      const formData = new FormData()
      formData.append("url", url)

      const result = await generateDeepLinkAction(formData)

      if (result.success) {
        setShortLink(result.shortLink)
        toast({
          title: "Link created successfully",
          description: "Your deep link has been generated",
        })
      } else {
        toast({
          title: "Error",
          description: result.error || "Failed to generate link",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error generating link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortLink)
    setIsCopied(true)
    setTimeout(() => setIsCopied(false), 2000)
  }

  const handleCaptchaVerified = () => {
    setCaptchaVerified(true)
  }

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              type="url"
              placeholder="Paste your app link here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              className="h-12"
            />
          </div>

          {showCaptcha && !captchaVerified && !user && <SimpleCaptcha onVerified={handleCaptchaVerified} />}

          <Button
            type="submit"
            className="w-full h-12 text-base"
            disabled={isGenerating || (showCaptcha && !captchaVerified && !user)}
          >
            {isGenerating ? "Generating..." : "Create Smart Link"}
          </Button>
        </form>

        {shortLink && (
          <div className="mt-4 p-3 bg-gray-50 rounded-md flex items-center justify-between">
            <span className="text-blue-600 font-medium truncate mr-2">{shortLink}</span>
            <Button variant="ghost" size="sm" onClick={copyToClipboard} className="flex-shrink-0">
              {isCopied ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />}
            </Button>
          </div>
        )}

        {!user && (
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">Create an account for more features</p>
            <Button variant="link" className="text-sm p-0 h-auto mt-1" asChild>
              <Link href="/signup">→ Sign up for free</Link>
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
