"use client"

import { useEffect } from "react"
import { useAuth } from "@/contexts/auth-context"

export function SessionRefresh() {
  const { session, refreshSession } = useAuth()

  useEffect(() => {
    // Set up a timer to refresh the session every 10 minutes
    const refreshInterval = setInterval(
      () => {
        refreshSession()
      },
      10 * 60 * 1000,
    ) // 10 minutes

    return () => clearInterval(refreshInterval)
  }, [refreshSession])

  return null
}
