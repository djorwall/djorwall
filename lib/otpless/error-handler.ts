import { toast } from "@/components/ui/use-toast"

export const otplessErrorMessages: Record<string, string> = {
  invalid_token: "Authentication failed. Please try again.",
  expired_token: "Authentication session expired. Please try again.",
  user_cancelled: "Authentication was cancelled. Please try again when you're ready.",
  network_error: "Network error. Please check your connection and try again.",
  default: "An error occurred during authentication. Please try again.",
}

export function handleOtplessError(error: string) {
  const errorMessage = otplessErrorMessages[error] || otplessErrorMessages.default

  toast({
    title: "Authentication Error",
    description: errorMessage,
    variant: "destructive",
  })

  // Log the error for debugging
  console.error("OTPless error:", error)

  return errorMessage
}
