"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OldDashboardPage() {
  const router = useRouter()

  useEffect(() => {
    router.replace("/dashboard")
  }, [router])

  return (
    <div className="container py-8 flex justify-center items-center min-h-[calc(100vh-8rem)]">
      <div className="text-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
        <p>Redirecting to the new dashboard...</p>
      </div>
    </div>
  )
}
