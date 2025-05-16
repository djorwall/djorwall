import { Suspense } from "react"
import type { Metadata } from "next"
import ApiSettingsForm from "@/components/admin/api-settings-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "API Settings | Admin",
  description: "Manage API credentials and settings",
}

export default function ApiSettingsPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-3xl font-bold mb-6">API Settings</h1>

      <Tabs defaultValue="recaptcha" className="space-y-6">
        <TabsList>
          <TabsTrigger value="recaptcha">reCAPTCHA</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="recaptcha">
          <Card>
            <CardHeader>
              <CardTitle>Google reCAPTCHA Settings</CardTitle>
              <CardDescription>
                Configure your Google reCAPTCHA credentials. These will be used for bot protection throughout the
                application.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Suspense fallback={<SettingsFormSkeleton />}>
                <ApiSettingsForm type="recaptcha" />
              </Suspense>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Analytics API Settings</CardTitle>
              <CardDescription>
                Configure analytics API credentials for enhanced tracking and reporting.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Analytics API settings will be available in a future update.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function SettingsFormSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-[150px]" />
        <Skeleton className="h-10 w-full" />
      </div>
      <Skeleton className="h-10 w-[100px]" />
    </div>
  )
}
