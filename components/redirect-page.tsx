"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface RedirectPageProps {
  shortId: string
  originalUrl: string
  androidUrl: string | null
  iosUrl: string | null
  fallbackUrl: string
}

export function RedirectPage({ shortId, originalUrl, androidUrl, iosUrl, fallbackUrl }: RedirectPageProps) {
  const [countdown, setCountdown] = useState(5)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Determine the redirect URL based on platform
  const getRedirectUrl = () => {
    const userAgent = navigator.userAgent.toLowerCase()

    if (/android/i.test(userAgent) && androidUrl) {
      return androidUrl
    } else if (/iphone|ipad|ipod/i.test(userAgent) && iosUrl) {
      return iosUrl
    }

    return fallbackUrl || originalUrl
  }

  const handleRedirect = () => {
    setIsRedirecting(true)

    // Redirect after a short delay
    setTimeout(() => {
      window.location.href = getRedirectUrl()
    }, 500)
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          // Automatically redirect when countdown reaches zero
          handleRedirect()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <main className="flex-1 flex flex-col items-center p-4 md:p-6 space-y-6">
        <div className="w-full max-w-xl">
          <h1 className="text-2xl font-bold mb-4 text-center">Your link is ready</h1>

          {/* Ad Space - 1:1 Aspect Ratio */}
          <div className="w-full relative mb-6">
            <div className="aspect-square w-full bg-gray-100 border rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground text-center p-4">Advertisement Space</p>
            </div>
          </div>

          {/* Countdown and Button - Below Ad */}
          <div className="w-full flex flex-col items-center space-y-4">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-2">
                <span className="text-xl font-bold text-primary">{countdown}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isRedirecting ? "Redirecting you now..." : `Redirecting in ${countdown} seconds`}
              </p>
            </div>

            <Button size="lg" className="w-full max-w-xs" disabled={isRedirecting} onClick={handleRedirect}>
              {isRedirecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Redirecting...
                </>
              ) : (
                "Continue Now"
              )}
            </Button>

            <p className="text-xs text-muted-foreground text-center">Link ID: {shortId}</p>
          </div>
        </div>
      </main>
    </div>
  )
}
