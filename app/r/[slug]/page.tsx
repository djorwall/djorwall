"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { detectApp, generateAppDeepLink } from "@/lib/deep-link-utils"
import { getRedirectInfoAction, trackClickAction, getDefaultRedirectTemplateAction } from "@/app/actions"
import { useToast } from "@/hooks/use-toast"
import type { RedirectTemplateData } from "@/lib/db"

export default function RedirectPage() {
  const params = useParams<{ slug: string }>()
  const router = useRouter()
  const [countdown, setCountdown] = useState(5)
  const [progress, setProgress] = useState(0)
  const [targetUrl, setTargetUrl] = useState("")
  const [isRedirecting, setIsRedirecting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [template, setTemplate] = useState<RedirectTemplateData | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const result = await getDefaultRedirectTemplateAction()
        if (result.success) {
          setTemplate(result.template)
        } else {
          // Use fallback template if default not found
          setTemplate({
            id: "fallback",
            name: "Fallback Template",
            description: "Fallback template when no default is found",
            isDefault: true,
            countdownDuration: 5,
            showSkipButton: true,
            showProgressBar: true,
            adPlacement: "center",
            headerText: "Redirecting you to the app",
            footerText: "Powered by Appopener.io",
            backgroundColor: "#ffffff",
            textColor: "#000000",
            accentColor: "#3b82f6",
            customCSS: null,
            customJS: null,
            adCode: '<div class="p-4 bg-gray-100 rounded-md text-center">Advertisement Space</div>',
            logoEnabled: true,
            logoUrl: "/abstract-logo.png",
            backgroundImageEnabled: false,
            backgroundImageUrl: null,
            videoEnabled: false,
            videoUrl: null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            userId: null,
          })
        }
      } catch (error) {
        console.error("Error fetching template:", error)
      }
    }

    fetchTemplate()
  }, [])

  useEffect(() => {
    const slug = params.slug

    const fetchLinkInfo = async () => {
      try {
        setIsLoading(true)
        const result = await getRedirectInfoAction(slug)

        if (!result.success) {
          setError(result.error || "Link not found")
          return
        }

        // Track the click
        await trackClickAction(result.id)

        // Determine the target URL
        const platform = navigator.userAgent.match(/Android/i)
          ? "android"
          : navigator.userAgent.match(/iPhone|iPad|iPod/i)
            ? "ios"
            : "other"
        const app = detectApp(result.originalUrl)
        const deepLink = generateAppDeepLink(result.originalUrl, platform as any, app)

        setTargetUrl(deepLink)
        setIsLoading(false)

        // Start countdown once template is loaded
        if (template) {
          setCountdown(template.countdownDuration)

          const timer = setInterval(() => {
            setCountdown((prev) => {
              if (prev <= 1) {
                clearInterval(timer)
                handleRedirect()
                return 0
              }
              setProgress((template.countdownDuration - prev + 1) * (100 / template.countdownDuration))
              return prev - 1
            })
          }, 1000)

          return () => clearInterval(timer)
        }
      } catch (error) {
        console.error("Error fetching link info:", error)
        setError("An unexpected error occurred")
        setIsLoading(false)
      }
    }

    if (template) {
      fetchLinkInfo()
    }
  }, [params.slug, template])

  const handleRedirect = () => {
    if (!targetUrl) return

    setIsRedirecting(true)

    // Redirect to the target URL
    window.location.href = targetUrl
  }

  if (error) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h1 className="text-xl font-semibold text-red-500">Error</h1>
              <p className="text-gray-500">{error}</p>
              <Button onClick={() => router.push("/")} className="mt-4">
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isLoading || !template) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-8">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              <p className="text-gray-500">Loading...</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Custom styles based on template
  const customStyle = {
    backgroundColor: template.backgroundColor,
    color: template.textColor,
    backgroundImage:
      template.backgroundImageEnabled && template.backgroundImageUrl ? `url(${template.backgroundImageUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  const accentStyle = {
    backgroundColor: template.accentColor,
    color: "#ffffff",
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={customStyle}>
      {template.customCSS && <style dangerouslySetInnerHTML={{ __html: template.customCSS }} />}

      {template.videoEnabled && template.videoUrl && (
        <div className="absolute inset-0 overflow-hidden z-0">
          <video src={template.videoUrl} autoPlay loop muted className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black bg-opacity-50" />
        </div>
      )}

      <div className="relative z-10 w-full max-w-md mx-auto p-4">
        <Card className="w-full" style={{ backgroundColor: template.backgroundColor, color: template.textColor }}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              {template.logoEnabled && template.logoUrl && (
                <div className="mb-2">
                  <img src={template.logoUrl || "/placeholder.svg"} alt="Logo" className="h-16 w-auto" />
                </div>
              )}

              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold"
                style={accentStyle}
              >
                {countdown}
              </div>

              <h1 className="text-xl font-semibold">{template.headerText}</h1>

              <p className="text-sm text-gray-500">
                You are being redirected to the app. If it doesn't open automatically, click the button below.
              </p>

              {template.showProgressBar && (
                <div className="w-full">
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Ad space based on placement */}
              {template.adCode && (
                <div
                  className={`w-full my-4 ${
                    template.adPlacement === "top"
                      ? "order-first"
                      : template.adPlacement === "bottom"
                        ? "order-last"
                        : template.adPlacement === "side"
                          ? "md:absolute md:right-[-250px] md:top-0 md:w-[200px] md:h-full"
                          : ""
                  }`}
                  dangerouslySetInnerHTML={{ __html: template.adCode }}
                />
              )}

              <Button
                onClick={handleRedirect}
                disabled={(!template.showSkipButton && countdown > 0) || isRedirecting || !targetUrl}
                className="w-full"
                style={accentStyle}
              >
                {isRedirecting ? "Opening..." : template.showSkipButton ? "Skip" : "GO"}
              </Button>

              <Button variant="link" onClick={() => router.push("/")} className="text-sm">
                Return to Appopener.io
              </Button>

              <div className="text-xs opacity-70 mt-4">{template.footerText}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {template.customJS && <script dangerouslySetInnerHTML={{ __html: template.customJS }} />}
    </div>
  )
}
