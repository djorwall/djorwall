"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"
import { Copy, Link2 } from "lucide-react"
import { createLink } from "@/app/actions/links"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const [url, setUrl] = useState("")
  const [shortUrl, setShortUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

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

        // Refresh the page to show the new link
        router.refresh()
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

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create Smart Link</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create a new smart link</CardTitle>
          <CardDescription>
            Enter any URL to create a smart link that opens in native apps when available
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input type="url" placeholder="Paste any link" value={url} onChange={(e) => setUrl(e.target.value)} />
            </div>

            <Button type="submit" disabled={isLoading || !url}>
              {isLoading ? "Creating..." : "Create Smart Link"}
            </Button>
          </form>

          {shortUrl && (
            <div className="mt-6 p-4 border rounded-lg bg-secondary/50">
              <div className="flex items-center justify-between">
                <div className="font-medium text-primary truncate mr-2">{shortUrl}</div>
                <Button variant="ghost" size="icon" onClick={copyToClipboard} title="Copy to clipboard">
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex items-center text-xs text-muted-foreground">
                <Link2 className="h-3 w-3 mr-1" />
                <span>Smart link created successfully</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      <Toaster />
    </div>
  )
}
