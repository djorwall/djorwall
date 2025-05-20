"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MathPuzzle } from "@/components/math-puzzle"
import { Copy, ExternalLink, Smartphone, LogIn } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { createLink } from "@/app/actions/links"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import Link from "next/link"

export function UrlShortener() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isPuzzleVerified, setIsPuzzleVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
      setIsCheckingAuth(false)
    }

    checkAuth()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    if (!isLoggedIn && !isPuzzleVerified) {
      toast({
        title: "Verification Required",
        description: "Please solve the math puzzle to verify you're human",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("url", url)

      const result = await createLink(formData)

      if (result.success && result.data) {
        setShortUrl(result.data.shortUrl)
        toast({
          title: "Success!",
          description: "Your smart link has been created",
        })
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to create link. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error creating link:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl)
    toast({
      title: "Copied!",
      description: "Link copied to clipboard",
    })
  }

  if (isCheckingAuth) {
    return <div className="w-full max-w-md mx-auto text-center">Loading...</div>
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Input
            type="url"
            placeholder="Paste any link"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
          />
        </div>

        {!isLoggedIn && <MathPuzzle onVerify={(verified) => setIsPuzzleVerified(verified)} />}

        <Button
          type="submit"
          className="w-full h-12 text-base"
          disabled={isLoading || !url || (!isLoggedIn && !isPuzzleVerified)}
        >
          {isLoading ? "Creating..." : "Create Smart Link"}
        </Button>

        {!isLoggedIn && (
          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">Create an account for more features</p>
            <Button variant="outline" asChild className="w-full">
              <Link href="/signup" className="flex items-center justify-center gap-2">
                <LogIn className="h-4 w-4" />
                <span>Sign up for free</span>
              </Link>
            </Button>
          </div>
        )}
      </form>

      {shortUrl && (
        <div className="mt-6 p-4 border rounded-lg bg-white">
          <div className="flex items-center justify-between">
            <div className="font-medium text-primary truncate mr-2">{shortUrl}</div>
            <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex items-center text-xs text-muted-foreground">
            <Smartphone className="h-3 w-3 mr-1" />
            <span>Opens in native app if installed</span>
          </div>
          <div className="mt-3 flex justify-end">
            <Button variant="outline" size="sm" asChild>
              <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                <span>Open</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </Button>
          </div>
        </div>
      )}
      <Toaster />
    </div>
  )
}
