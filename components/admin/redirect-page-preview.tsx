"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface RedirectPagePreviewProps {
  template: {
    name: string
    countdownDuration: number
    showSkipButton: boolean
    showProgressBar: boolean
    adPlacement: string
    headerText: string
    footerText: string
    backgroundColor: string
    textColor: string
    accentColor: string
    customCSS: string
    customJS: string
    adCode: string
    logoEnabled: boolean
    logoUrl: string
    backgroundImageEnabled: boolean
    backgroundImageUrl: string
    videoEnabled: boolean
    videoUrl: string
  }
}

export function RedirectPagePreview({ template }: RedirectPagePreviewProps) {
  const [countdown, setCountdown] = useState(template.countdownDuration)
  const [progress, setProgress] = useState(0)
  const [isRedirecting, setIsRedirecting] = useState(false)

  // Reset countdown when template changes
  useEffect(() => {
    setCountdown(template.countdownDuration)
    setProgress(0)
    setIsRedirecting(false)
  }, [template])

  // Simulate countdown for preview
  useEffect(() => {
    if (countdown <= 0 || isRedirecting) return

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1)
      setProgress((prev) => prev + 100 / template.countdownDuration)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, template.countdownDuration, isRedirecting])

  const handleSkip = () => {
    setIsRedirecting(true)
    setCountdown(0)
    setProgress(100)
  }

  // Create custom styles
  const customStyle = {
    backgroundColor: template.backgroundColor,
    color: template.textColor,
    backgroundImage: template.backgroundImageEnabled ? `url(${template.backgroundImageUrl})` : "none",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }

  const accentStyle = {
    backgroundColor: template.accentColor,
    color: "#ffffff",
  }

  const renderAdSection = () => {
    return (
      <div
        className="ad-container p-4 bg-gray-100 rounded-md text-center"
        dangerouslySetInnerHTML={{ __html: template.adCode }}
      />
    )
  }

  return (
    <div className="preview-container border rounded-md overflow-hidden" style={{ height: "600px" }}>
      <style dangerouslySetInnerHTML={{ __html: template.customCSS }} />

      <div className="redirect-page flex flex-col h-full" style={customStyle}>
        {template.videoEnabled && (
          <div className="absolute inset-0 overflow-hidden z-0">
            <video
              src={template.videoUrl || "https://example.com/video.mp4"}
              autoPlay
              loop
              muted
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50" />
          </div>
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Top Ad Placement */}
          {template.adPlacement === "top" && <div className="p-4">{renderAdSection()}</div>}

          {/* Main Content */}
          <div className={`flex ${template.adPlacement === "side" ? "flex-row" : "flex-col"} flex-1`}>
            {/* Side Ad Placement */}
            {template.adPlacement === "side" && (
              <div className="w-1/4 p-4 border-r" style={{ borderColor: template.accentColor }}>
                {renderAdSection()}
              </div>
            )}

            <div
              className={`flex-1 flex flex-col items-center justify-center p-6 ${template.adPlacement === "side" ? "w-3/4" : "w-full"}`}
            >
              {template.logoEnabled && (
                <div className="mb-6">
                  <img src={template.logoUrl || "/placeholder.svg"} alt="Logo" className="h-16 w-auto" />
                </div>
              )}

              <h1 className="text-2xl font-bold mb-6 text-center">{template.headerText}</h1>

              <div
                className="flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold mb-4"
                style={accentStyle}
              >
                {countdown}
              </div>

              <p className="text-center mb-6">
                {countdown > 0 ? `Redirecting in ${countdown} seconds...` : "Redirecting now..."}
              </p>

              {template.showProgressBar && (
                <div className="w-full max-w-md mb-6">
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              {/* Center Ad Placement */}
              {template.adPlacement === "center" && <div className="w-full max-w-md mb-6">{renderAdSection()}</div>}

              {template.showSkipButton && (
                <Button
                  onClick={handleSkip}
                  disabled={countdown === 0 || isRedirecting}
                  style={accentStyle}
                  className="w-full max-w-md"
                >
                  {isRedirecting ? "Redirecting..." : "Skip"}
                </Button>
              )}
            </div>
          </div>

          {/* Bottom Ad Placement */}
          {template.adPlacement === "bottom" && <div className="p-4">{renderAdSection()}</div>}

          {/* Footer */}
          <div className="p-4 text-center text-sm opacity-70">{template.footerText}</div>
        </div>
      </div>

      <script dangerouslySetInnerHTML={{ __html: template.customJS }} />
    </div>
  )
}
