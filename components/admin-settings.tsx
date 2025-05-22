"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function AdminSettings() {
  const [settings, setSettings] = useState({
    countdownDuration: 5,
    enableCaptcha: true,
    enableAds: true,
    adHtml: '<div class="w-full p-4 bg-gray-100 rounded-md text-center">Advertisement Space</div>',
    apiKey: "sk_live_example_key_123456789",
    webhookUrl: "https://example.com/webhook",
    emailNotifications: true,
    slackNotifications: false,
    dataRetentionDays: 90,
    mailingListApiKey: "",
    analyticsTrackingId: "",
  })

  const [isLoading, setIsLoading] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    // Load settings from local storage
    const storedSettings = localStorage.getItem("appopener_admin_settings")
    if (storedSettings) {
      setSettings(JSON.parse(storedSettings))
    }
  }, [])

  const handleSaveSettings = () => {
    setIsLoading(true)
    setSaveStatus("idle")

    // Simulate API call
    setTimeout(() => {
      try {
        // Save settings to local storage
        localStorage.setItem("appopener_admin_settings", JSON.stringify(settings))
        setIsLoading(false)
        setSaveStatus("success")
        toast({
          title: "Settings saved",
          description: "Your settings have been saved successfully.",
        })

        // Reset success status after 3 seconds
        setTimeout(() => setSaveStatus("idle"), 3000)
      } catch (error) {
        setIsLoading(false)
        setSaveStatus("error")
        toast({
          title: "Error saving settings",
          description: "There was a problem saving your settings.",
          variant: "destructive",
        })
      }
    }, 1000)
  }

  const handleResetSettings = () => {
    const defaultSettings = {
      countdownDuration: 5,
      enableCaptcha: true,
      enableAds: true,
      adHtml: '<div class="w-full p-4 bg-gray-100 rounded-md text-center">Advertisement Space</div>',
      apiKey: "sk_live_example_key_123456789",
      webhookUrl: "https://example.com/webhook",
      emailNotifications: true,
      slackNotifications: false,
      dataRetentionDays: 90,
      mailingListApiKey: "",
      analyticsTrackingId: "",
    }

    setSettings(defaultSettings)
    localStorage.setItem("appopener_admin_settings", JSON.stringify(defaultSettings))

    toast({
      title: "Settings reset",
      description: "Your settings have been reset to default values.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleResetSettings}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Defaults
          </Button>
          <Button onClick={handleSaveSettings} disabled={isLoading}>
            {isLoading ? (
              <>
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>

      {saveStatus === "success" && (
        <Alert variant="default" className="bg-green-50 text-green-800 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>Settings saved successfully.</AlertDescription>
        </Alert>
      )}

      {saveStatus === "error" && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>There was a problem saving your settings.</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="redirect">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="redirect">Redirect</TabsTrigger>
          <TabsTrigger value="advertising">Advertising</TabsTrigger>
          <TabsTrigger value="integrations">Integrations</TabsTrigger>
          <TabsTrigger value="system">System</TabsTrigger>
        </TabsList>

        <TabsContent value="redirect" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Redirect Settings</CardTitle>
              <CardDescription>Configure how the redirect page behaves</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="countdown">Countdown Duration (seconds)</Label>
                <Input
                  id="countdown"
                  type="number"
                  min="0"
                  max="30"
                  value={settings.countdownDuration}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      countdownDuration: Number.parseInt(e.target.value),
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="captcha">Enable Captcha</Label>
                  <p className="text-sm text-muted-foreground">Require captcha verification before generating links</p>
                </div>
                <Switch
                  id="captcha"
                  checked={settings.enableCaptcha}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enableCaptcha: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="ads">Enable Ads</Label>
                  <p className="text-sm text-muted-foreground">Show advertisements on the redirect page</p>
                </div>
                <Switch
                  id="ads"
                  checked={settings.enableAds}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      enableAds: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="advertising" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Advertisement Settings</CardTitle>
              <CardDescription>Configure the advertisement HTML</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="adHtml">Ad HTML</Label>
                <Textarea
                  id="adHtml"
                  rows={5}
                  value={settings.adHtml}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      adHtml: e.target.value,
                    })
                  }
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Enter the HTML code for your advertisement. This will be displayed on the redirect page.
                </p>
              </div>

              <div>
                <Label>Preview</Label>
                <div className="mt-2 p-4 border rounded-md">
                  <div dangerouslySetInnerHTML={{ __html: settings.adHtml }} />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="integrations" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>API Integration</CardTitle>
              <CardDescription>Configure API settings and webhooks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="apiKey">API Key</Label>
                <div className="flex">
                  <Input
                    id="apiKey"
                    type="password"
                    value={settings.apiKey}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apiKey: e.target.value,
                      })
                    }
                  />
                  <Button variant="outline" className="ml-2">
                    Regenerate
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">This is your API key for accessing the AppOpener API.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhookUrl">Webhook URL</Label>
                <Input
                  id="webhookUrl"
                  value={settings.webhookUrl}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      webhookUrl: e.target.value,
                    })
                  }
                  placeholder="https://example.com/webhook"
                />
                <p className="text-xs text-muted-foreground">
                  Webhooks allow external applications to be notified when events happen.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mailingListApiKey">Mailing List API Key</Label>
                <Input
                  id="mailingListApiKey"
                  value={settings.mailingListApiKey}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      mailingListApiKey: e.target.value,
                    })
                  }
                  placeholder="Enter your mailing list API key"
                />
                <p className="text-xs text-muted-foreground">
                  Integration with mailing list providers like Mailchimp or SendGrid.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="analyticsTrackingId">Analytics Tracking ID</Label>
                <Input
                  id="analyticsTrackingId"
                  value={settings.analyticsTrackingId}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      analyticsTrackingId: e.target.value,
                    })
                  }
                  placeholder="Enter your Google Analytics tracking ID"
                />
                <p className="text-xs text-muted-foreground">
                  Connect with Google Analytics to track additional metrics.
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure notification settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="emailNotifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                </div>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      emailNotifications: checked,
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="slackNotifications">Slack Notifications</Label>
                  <p className="text-sm text-muted-foreground">Receive notifications via Slack</p>
                </div>
                <Switch
                  id="slackNotifications"
                  checked={settings.slackNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({
                      ...settings,
                      slackNotifications: checked,
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-4 pt-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>Configure system-wide settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="dataRetention">Data Retention (days)</Label>
                <Input
                  id="dataRetention"
                  type="number"
                  min="1"
                  max="365"
                  value={settings.dataRetentionDays}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      dataRetentionDays: Number.parseInt(e.target.value),
                    })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Set how long analytics and log data will be stored before automatic deletion.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Database Maintenance</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Run Database Cleanup</Button>
                  <Button variant="outline">Export Database Backup</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Regular database maintenance helps keep the system running efficiently.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Cache Management</h3>
                <div className="grid grid-cols-2 gap-4">
                  <Button variant="outline">Clear System Cache</Button>
                  <Button variant="outline">Rebuild Asset Cache</Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Clearing cache can help resolve certain performance issues.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
