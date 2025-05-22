"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { generateDeepLinkAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"

interface LinkCreatorProps {
  onSuccess?: () => void
}

export function LinkCreator({ onSuccess }: LinkCreatorProps) {
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!url) return

    setIsLoading(true)

    try {
      const formData = new FormData()
      formData.append("url", url)

      const result = await generateDeepLinkAction(formData)

      if (result.success) {
        toast({
          title: "Link created successfully",
          description: "Your deep link has been generated",
        })
        setUrl("")
        if (onSuccess) {
          onSuccess()
        }
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
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="url"
        placeholder="Paste your app link here..."
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        required
        className="max-w-xs"
      />
      <Button type="submit" size="sm" disabled={isLoading}>
        {isLoading ? "Creating..." : "Create a link"}
      </Button>
    </form>
  )
}
