"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { getApiSettings, updateApiSettings } from "@/app/actions/admin"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ExternalLink } from "lucide-react"

// Define the form schema for reCAPTCHA settings
const recaptchaFormSchema = z.object({
  siteKey: z.string().min(1, "Site key is required"),
  secretKey: z.string().min(1, "Secret key is required"),
})

type RecaptchaFormValues = z.infer<typeof recaptchaFormSchema>

// Default values for the form
const defaultRecaptchaValues: RecaptchaFormValues = {
  siteKey: "",
  secretKey: "",
}

interface ApiSettingsFormProps {
  type: "recaptcha" | "analytics" | "other"
}

export default function ApiSettingsForm({ type }: ApiSettingsFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [initialValues, setInitialValues] = useState<RecaptchaFormValues>(defaultRecaptchaValues)
  const [activeTab, setActiveTab] = useState<string>("settings")

  // Initialize the form with react-hook-form
  const form = useForm<RecaptchaFormValues>({
    resolver: zodResolver(recaptchaFormSchema),
    defaultValues: initialValues,
  })

  // Fetch existing settings on component mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const settings = await getApiSettings(type)
        if (settings && settings.success) {
          const data = settings.data as RecaptchaFormValues
          setInitialValues(data)
          form.reset(data)
        }
      } catch (error) {
        console.error("Error fetching API settings:", error)
        toast({
          title: "Error",
          description: "Failed to load existing settings. Using defaults.",
          variant: "destructive",
        })
      }
    }

    fetchSettings()
  }, [type, form, toast])

  // Handle form submission
  async function onSubmit(data: RecaptchaFormValues) {
    setIsLoading(true)

    try {
      const result = await updateApiSettings(type, data)

      if (result.success) {
        toast({
          title: "Settings updated",
          description: "reCAPTCHA settings have been successfully updated.",
        })
        router.refresh()
      } else {
        toast({
          title: "Error",
          description: result.message || "Failed to update settings. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error updating API settings:", error)
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (type === "recaptcha") {
    return (
      <Tabs defaultValue="settings" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="help">Help & Documentation</TabsTrigger>
        </TabsList>
        <TabsContent value="settings" className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="siteKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Site Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter site key" {...field} />
                    </FormControl>
                    <FormDescription>The public key used in your frontend code.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="secretKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Secret Key</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter secret key" type="password" {...field} />
                    </FormControl>
                    <FormDescription>The private key used for server-side verification.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Settings"}
              </Button>
            </form>
          </Form>
        </TabsContent>
        <TabsContent value="help" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Google reCAPTCHA</CardTitle>
              <CardDescription>How to set up Google reCAPTCHA</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li>
                  Go to the{" "}
                  <a
                    href="https://www.google.com/recaptcha/admin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline inline-flex items-center"
                  >
                    Google reCAPTCHA Admin Console <ExternalLink className="h-3 w-3 ml-1" />
                  </a>
                </li>
                <li>Sign in with your Google account</li>
                <li>Click "+" to create a new site registration</li>
                <li>Enter a label for your site (e.g., "Appopener.io")</li>
                <li>Select the reCAPTCHA type (v2 Checkbox is recommended)</li>
                <li>Add your domain(s) to the list of allowed domains</li>
                <li>Accept the terms of service and click "Submit"</li>
                <li>Copy the "Site Key" and "Secret Key" provided</li>
                <li>Enter these keys in the Settings tab</li>
              </ol>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    )
  }

  return <div>Form not available for this type</div>
}
