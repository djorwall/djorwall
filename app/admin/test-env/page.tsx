"use client"

import { useState, useEffect } from "react"
import { getSiteUrl } from "@/lib/url-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, XCircle, AlertCircle } from "lucide-react"
import ServerEnvironmentTest from "./server-test"

export default function TestEnvironmentPage() {
  const [clientUrl, setClientUrl] = useState<string>("")
  const [windowLocation, setWindowLocation] = useState<string>("")
  const [isLoading, setIsLoading] = useState(true)
  const [testResults, setTestResults] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    // Get the URL on the client side
    setClientUrl(getSiteUrl())
    setWindowLocation(`${window.location.protocol}//${window.location.host}`)
    setIsLoading(false)

    // Run tests
    const results = {
      siteUrlSet: !!process.env.NEXT_PUBLIC_SITE_URL,
      vercelUrlSet: !!process.env.NEXT_PUBLIC_VERCEL_URL,
      getSiteUrlWorks: getSiteUrl() !== "",
      urlsMatch: false,
    }

    // Check if URLs match (will be updated after state is set)
    setTimeout(() => {
      setTestResults({
        ...results,
        urlsMatch: getSiteUrl() === `${window.location.protocol}//${window.location.host}`,
      })
    }, 100)
  }, [])

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => alert("Copied to clipboard!"))
      .catch((err) => console.error("Failed to copy: ", err))
  }

  const StatusIndicator = ({ condition }: { condition: boolean }) =>
    condition ? <CheckCircle className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />

  return (
    <div className="container py-10 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Environment Variables Test</h1>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="details">Detailed Info</TabsTrigger>
          <TabsTrigger value="server">Server Variables</TabsTrigger>
          <TabsTrigger value="troubleshooting">Troubleshooting</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Environment Test Results
                {isLoading && <Badge variant="outline">Loading...</Badge>}
              </CardTitle>
              <CardDescription>Quick overview of your environment configuration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">URL Detection</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span>getSiteUrl() works:</span>
                        <StatusIndicator condition={!!testResults.getSiteUrlWorks} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>URLs match browser:</span>
                        <StatusIndicator condition={!!testResults.urlsMatch} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Environment Variables</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between mb-2">
                        <span>NEXT_PUBLIC_SITE_URL:</span>
                        <StatusIndicator condition={!!testResults.siteUrlSet} />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>VERCEL_URL:</span>
                        <StatusIndicator condition={!!testResults.vercelUrlSet} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium mb-2">Detected URLs</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">getSiteUrl():</span>
                        <span className="ml-2">{isLoading ? "Loading..." : clientUrl}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(clientUrl)}
                        disabled={isLoading}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">Browser URL:</span>
                        <span className="ml-2">{isLoading ? "Loading..." : windowLocation}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(windowLocation)}
                        disabled={isLoading}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => window.location.reload()}>Refresh Tests</Button>
          </div>
        </TabsContent>

        <TabsContent value="details">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Environment Variables</CardTitle>
              <CardDescription>All environment variables accessible to the client</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium mb-2">Next.js Public Variables</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">NEXT_PUBLIC_SITE_URL:</span>
                        <span className="ml-2">{process.env.NEXT_PUBLIC_SITE_URL || "Not set"}</span>
                      </div>
                      {process.env.NEXT_PUBLIC_SITE_URL && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_SITE_URL || "")}
                        >
                          Copy
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">NEXT_PUBLIC_VERCEL_URL:</span>
                        <span className="ml-2">{process.env.NEXT_PUBLIC_VERCEL_URL || "Not set"}</span>
                      </div>
                      {process.env.NEXT_PUBLIC_VERCEL_URL && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => copyToClipboard(process.env.NEXT_PUBLIC_VERCEL_URL || "")}
                        >
                          Copy
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg border">
                  <h3 className="font-medium mb-2">URL Detection Results</h3>
                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">getSiteUrl() result:</span>
                        <span className="ml-2">{isLoading ? "Loading..." : clientUrl}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(clientUrl)}
                        disabled={isLoading}
                      >
                        Copy
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-medium">window.location:</span>
                        <span className="ml-2">{isLoading ? "Loading..." : windowLocation}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => copyToClipboard(windowLocation)}
                        disabled={isLoading}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="server">
          <ServerEnvironmentTest />
        </TabsContent>

        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting Guide</CardTitle>
              <CardDescription>Common issues and how to fix them</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-amber-800">Environment Variables Not Showing</h3>
                      <p className="text-sm text-amber-700 mt-1">If your environment variables aren't showing up:</p>
                      <ul className="list-disc ml-5 mt-2 text-sm text-amber-700 space-y-1">
                        <li>Make sure they're prefixed with NEXT_PUBLIC_ to be accessible on the client</li>
                        <li>Verify they're set in your .env.local file for development</li>
                        <li>Check they're added in your Vercel project settings</li>
                        <li>Redeploy your application after adding new environment variables</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-blue-800">URL Detection Issues</h3>
                      <p className="text-sm text-blue-700 mt-1">
                        If the getSiteUrl() function isn't returning the expected URL:
                      </p>
                      <ul className="list-disc ml-5 mt-2 text-sm text-blue-700 space-y-1">
                        <li>Set NEXT_PUBLIC_SITE_URL explicitly to override automatic detection</li>
                        <li>For Vercel deployments, check if VERCEL_URL is being set correctly</li>
                        <li>Ensure your custom domain is properly configured in Vercel</li>
                        <li>For local development, the function should return http://localhost:3000</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <h3 className="font-medium text-green-800">Testing Server-Side Variables</h3>
                      <p className="text-sm text-green-700 mt-1">
                        To test server-side environment variables (not visible on this page):
                      </p>
                      <ul className="list-disc ml-5 mt-2 text-sm text-green-700 space-y-1">
                        <li>Create a server component or API route that logs or returns the variables</li>
                        <li>Check your deployment logs in the Vercel dashboard</li>
                        <li>Use console.log in server components during development</li>
                        <li>Remember that non-NEXT_PUBLIC_ variables are only available server-side</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
