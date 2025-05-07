"use client"

import { useEffect, useState } from "react"
import { getSiteUrl } from "@/lib/url-utils"

export default function TestEnvPage() {
  const [clientUrl, setClientUrl] = useState<string>("")

  useEffect(() => {
    // Get the URL on the client side
    setClientUrl(getSiteUrl())
  }, [])

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Environment & URL Detection Test</h1>

      <div className="space-y-6">
        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Detected URLs</h2>
          <div className="space-y-2">
            <p>
              <strong>Client-side URL:</strong> {clientUrl || "Loading..."}
            </p>
            <p>
              <strong>Server-side URL:</strong> {getSiteUrl()}
            </p>
          </div>
        </div>

        <div className="p-4 bg-gray-50 rounded-lg border">
          <h2 className="text-lg font-semibold mb-2">Environment Variables</h2>
          <div className="space-y-2">
            <p>
              <strong>NEXT_PUBLIC_SITE_URL:</strong> {process.env.NEXT_PUBLIC_SITE_URL || "Not set"}
            </p>
            <p>
              <strong>VERCEL_URL:</strong> {process.env.NEXT_PUBLIC_VERCEL_URL || "Not set"}
            </p>
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h2 className="text-lg font-semibold mb-2">How It Works</h2>
          <p className="text-sm">The URL detection system uses a fallback approach:</p>
          <ol className="list-decimal ml-5 mt-2 text-sm space-y-1">
            <li>Uses the browser URL when available (client-side)</li>
            <li>Falls back to NEXT_PUBLIC_SITE_URL if set</li>
            <li>Detects deployment platform URLs (Vercel, Netlify, etc.)</li>
            <li>Uses localhost:3000 as a final fallback</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
