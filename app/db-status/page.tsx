"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { testDatabaseConnectionAction } from "@/app/actions"
import { CheckCircle, XCircle } from "lucide-react"

export default function DatabaseStatusPage() {
  const [status, setStatus] = useState<{
    success: boolean
    message?: string
    error?: string
    linksTable?: boolean
    analyticsTable?: boolean
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkDatabaseConnection = async () => {
      try {
        const result = await testDatabaseConnectionAction()
        setStatus(result)
      } catch (error) {
        console.error("Error checking database connection:", error)
        setStatus({
          success: false,
          error: "An unexpected error occurred",
        })
      } finally {
        setIsLoading(false)
      }
    }

    checkDatabaseConnection()
  }, [])

  return (
    <div className="container py-8">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Database Connection Status</CardTitle>
            <CardDescription>Checking connection to Supabase database</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-4">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
              </div>
            ) : status ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="flex-shrink-0">
                    {status.success ? (
                      <CheckCircle className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{status.success ? "Connection Successful" : "Connection Failed"}</p>
                    <p className="text-sm text-gray-500">
                      {status.message || status.error || "No additional information"}
                    </p>
                  </div>
                </div>

                {status.success && (
                  <div className="space-y-2 border-t pt-4 mt-4">
                    <p className="font-medium">Table Status:</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {status.linksTable ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm">Links Table</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0">
                          {status.analyticsTable ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                        <p className="text-sm">Analytics Table</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center text-gray-500">No status information available</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
