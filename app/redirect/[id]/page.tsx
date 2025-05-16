"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function RedirectPage({ params }: { params: { id: string } }) {
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleRedirect = () => {
    setIsRedirecting(true)

    // Detect platform and redirect accordingly
    const userAgent = navigator.userAgent.toLowerCase()
    let redirectUrl = "https://example.com" // Default fallback URL

    if (/android/i.test(userAgent)) {
      // Android intent
      redirectUrl = "intent://example.com/#Intent;scheme=https;package=com.example.app;end"
    } else if (/iphone|ipad|ipod/i.test(userAgent)) {
      // iOS scheme
      redirectUrl = "exampleapp://open?url=https://example.com"
    }

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = redirectUrl
    }, 500)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Ad Block */}
      <div className="w-full p-4 bg-gray-100 border-b text-center">
        <div className="max-w-3xl mx-auto h-24 flex items-center justify-center bg-gray-200 rounded">
          <p className="text-muted-foreground">Advertisement Space</p>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md text-center space-y-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Your link is ready</h1>
            <p className="text-muted-foreground">You will be redirected to your destination</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <span className="text-2xl font-bold text-primary">{countdown}</span>
            </div>
            <p className="text-sm text-muted-foreground">{countdown > 0 ? "Redirecting in..." : "Ready to proceed"}</p>
          </div>

          <Button size="lg" className="w-full" disabled={countdown > 0 || isRedirecting} onClick={handleRedirect}>
            {isRedirecting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Redirecting...
              </>
            ) : (
              "GO"
            )}
          </Button>

          <p className="text-xs text-muted-foreground">Link ID: {params.id}</p>
        </div>
      </main>
    </div>
  )
}
