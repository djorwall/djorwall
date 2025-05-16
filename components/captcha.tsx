"use client"

import { useState, useEffect, useRef } from "react"
import { Shield, AlertCircle } from "lucide-react"
import { getCaptchaSettings } from "@/app/actions/settings"
import { verifyReCaptcha } from "@/app/actions/captcha"
import { useToast } from "@/components/ui/use-toast"
import ReCAPTCHA from "react-google-recaptcha"

interface CaptchaProps {
  onVerify: (verified: boolean) => void
}

interface ReCaptchaSettings {
  siteKey: string
}

export function Captcha({ onVerify }: CaptchaProps) {
  const { toast } = useToast()
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [settings, setSettings] = useState<ReCaptchaSettings | null>(null)
  const [error, setError] = useState<string | null>(null)
  const recaptchaRef = useRef<ReCAPTCHA>(null)

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const result = await getCaptchaSettings()
        if (result.success && result.data) {
          setSettings(result.data as ReCaptchaSettings)
        } else {
          setError("Failed to load reCAPTCHA settings")
          console.error("Error loading reCAPTCHA settings:", result.message)
        }
      } catch (err) {
        setError("An unexpected error occurred")
        console.error("Error loading reCAPTCHA settings:", err)
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleReCaptchaChange = async (token: string | null) => {
    if (!token) {
      setIsVerified(false)
      onVerify(false)
      return
    }

    try {
      setIsLoading(true)
      const result = await verifyReCaptcha(token)

      if (result.success) {
        setIsVerified(true)
        onVerify(true)
      } else {
        setIsVerified(false)
        onVerify(false)
        toast({
          title: "Verification Failed",
          description: result.message || "Failed to verify reCAPTCHA. Please try again.",
          variant: "destructive",
        })
        // Reset the captcha so the user can try again
        recaptchaRef.current?.reset()
      }
    } catch (err) {
      console.error("Error verifying reCAPTCHA:", err)
      setIsVerified(false)
      onVerify(false)
      toast({
        title: "Verification Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
      // Reset the captcha so the user can try again
      recaptchaRef.current?.reset()
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading state
  if (isLoading && !settings) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-secondary/50">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary animate-pulse" />
          <span className="text-sm font-medium">Loading reCAPTCHA...</span>
        </div>
      </div>
    )
  }

  // Show error state if settings couldn't be loaded
  if (error || !settings || !settings.siteKey) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-secondary/50">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <span className="text-sm font-medium">reCAPTCHA Error</span>
        </div>
        <div className="text-xs text-destructive">
          {error || "reCAPTCHA is not properly configured. Please contact the administrator."}
        </div>
      </div>
    )
  }

  // If already verified, show success state
  if (isVerified) {
    return (
      <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-secondary/50">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-green-600" />
          <span className="text-sm font-medium">Verification Successful</span>
        </div>
        <div className="text-xs text-green-600">You have been verified successfully.</div>
      </div>
    )
  }

  // Render Google reCAPTCHA
  return (
    <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2 mb-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">reCAPTCHA Verification</span>
      </div>

      <ReCAPTCHA ref={recaptchaRef} sitekey={settings.siteKey} onChange={handleReCaptchaChange} />

      <div className="text-xs text-muted-foreground mt-2">
        This site is protected by reCAPTCHA and the Google{" "}
        <a
          href="https://policies.google.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Privacy Policy
        </a>{" "}
        and{" "}
        <a
          href="https://policies.google.com/terms"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          Terms of Service
        </a>{" "}
        apply.
      </div>
    </div>
  )
}
