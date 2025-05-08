"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, RefreshCw } from "lucide-react"

export default function ServerEnvironmentTest() {
  const [serverData, setServerData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchServerEnv = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/test-env?t=${Date.now()}`, {
        cache: "no-store",
      })

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`)
      }

      const data = await response.json()
      setServerData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error occurred")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchServerEnv()
  }, [])

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Server-Side Environment</CardTitle>
        <Button variant="outline" size="sm" onClick={fetchServerEnv} disabled={isLoading}>
          {isLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
          <span className="ml-2">Refresh</span>
        </Button>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="p-4 bg-red-50 text-red-700 rounded-lg border border-red-200">Error: {error}</div>
        ) : !serverData ? (
          <div className="flex justify-center p-4">
            <RefreshCw className="h-5 w-5 animate-spin" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">URL Detection</h3>
              <div className="grid grid-cols-1 gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">Server getSiteUrl():</span>
                    <span className="ml-2">{serverData.detectedUrl || "Not detected"}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 rounded-lg border">
              <h3 className="font-medium mb-2">Server Environment Variables</h3>
              <div className="grid grid-cols-1 gap-2">
                {Object.entries(serverData).map(([key, value]: [string, any]) => {
                  // Skip certain fields
                  if (["timestamp", "detectedUrl"].includes(key)) return null

                  return (
                    <div key={key} className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">{key}:</span>
                        <span className="ml-2">
                          {value === null
                            ? "Not set"
                            : typeof value === "boolean"
                              ? value
                                ? "Yes"
                                : "No"
                              : String(value)}
                        </span>
                      </div>
                      {value !== null && typeof value !== "boolean" && <StatusIndicator condition={!!value} />}
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="text-xs text-gray-500 text-right">
              Last updated: {new Date(serverData.timestamp).toLocaleTimeString()}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function StatusIndicator({ condition }: { condition: boolean }) {
  return condition ? <CheckCircle className="h-4 w-4 text-green-500" /> : <XCircle className="h-4 w-4 text-red-500" />
}
