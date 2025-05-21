"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoadingSpinner } from "@/components/ui/loading-spinner"

interface RedirectPageProps {
  url: string
  shortId: string
}

export function RedirectPage({ url, shortId }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(3)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Record the click
    const recordClick = async () => {
      try {
        await fetch(`/api/links/${shortId}/click`, {
          method: "POST",
        })
      } catch (err) {
        console.error("Error recording click:", err)
      }
    }

    recordClick()

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          try {
            window.location.href = url
          } catch (err) {
            setError("Invalid redirect URL. Please check the link and try again.")
          }
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [url, shortId])

  return (
    <div className="container max-w-md mx-auto py-12">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Redirecting you</CardTitle>
          <CardDescription>You are being redirected to the destination</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center py-8">
          {error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <>
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 mb-2">Redirecting in {countdown} seconds...</p>
              <p className="text-sm text-gray-500 truncate max-w-full">Destination: {url}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
