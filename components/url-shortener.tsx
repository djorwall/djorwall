"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

export function UrlShortener() {
  const router = useRouter()
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) {
      setError("Please enter a URL")
      return
    }

    // Basic URL validation
    try {
      new URL(url)
    } catch (err) {
      setError("Please enter a valid URL")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/links", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to create short link")
      }

      const shortUrl = `${window.location.origin}/${data.shortId}`
      setShortUrl(shortUrl)

      toast({
        title: "Link created!",
        description: "Your shortened URL has been created successfully.",
      })
    } catch (err) {
      console.error("Error creating short link:", err)
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      toast({
        title: "Copied!",
        description: "The shortened URL has been copied to your clipboard.",
      })
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">Shorten Your URL</CardTitle>
        <CardDescription>Enter a long URL to create a short, shareable link</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="url">URL to shorten</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very/long/url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? <LoadingSpinner size="sm" className="mr-2" /> : null}
            {isLoading ? "Creating..." : "Create Short Link"}
          </Button>
        </form>

        {shortUrl && (
          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <Label className="text-sm text-gray-500">Your shortened URL</Label>
            <div className="flex mt-1">
              <Input value={shortUrl} readOnly className="flex-1" />
              <Button variant="outline" className="ml-2" onClick={copyToClipboard}>
                Copy
              </Button>
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-center border-t pt-4">
        <Button variant="link" onClick={() => router.push("/login")}>
          Sign in to manage your links
        </Button>
      </CardFooter>
    </Card>
  )
}
