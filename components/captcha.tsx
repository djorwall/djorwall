"use client"

import { useState } from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Shield } from "lucide-react"

interface CaptchaProps {
  onVerify: (verified: boolean) => void
}

export function Captcha({ onVerify }: CaptchaProps) {
  const [isVerified, setIsVerified] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleVerify = () => {
    setIsLoading(true)

    // Simulate captcha verification
    setTimeout(() => {
      setIsVerified(true)
      setIsLoading(false)
      onVerify(true)
    }, 1500)
  }

  return (
    <div className="flex flex-col items-center gap-3 p-4 border rounded-lg bg-secondary/50">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-primary" />
        <span className="text-sm font-medium">Captcha Verification</span>
      </div>

      <div className="flex items-center gap-2">
        <Checkbox
          id="captcha"
          checked={isVerified}
          disabled={isLoading || isVerified}
          onCheckedChange={() => handleVerify()}
        />
        <label htmlFor="captcha" className="text-sm cursor-pointer">
          {isLoading ? "Verifying..." : "I'm not a robot"}
        </label>
      </div>

      {isVerified && <div className="text-xs text-green-600 font-medium">Verification successful</div>}

      {!isVerified && <div className="text-xs text-muted-foreground">Verification required to avoid bots</div>}
    </div>
  )
}
