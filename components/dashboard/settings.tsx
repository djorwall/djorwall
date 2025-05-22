"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Save, RefreshCw } from "lucide-react"

export function Settings() {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // Account settings
    email: "user@example.com",
    name: "John Doe",
    timezone: "UTC",
    emailNotifications: true,

    // App settings
    defaultRedirectDelay: 5,
    enableAnalytics: true,
    darkMode: false,

    // Link settings
    defaultLinkExpiration: 0, // 0 means never
    autoGenerateQrCodes: true,
    customDomain: "",

    // Campaign settings
    defaultCampaignDuration: 30, // days
    utmParameters: {
      defaultSource: "appopener",
      defaultMedium: "link",
    },
  })

  useEffect(() => {
    // Load settings from local storage
    const storedSettings = localStorage.getItem("appopener_user_settings")
    if (storedSettings) {
      try {
        setSettings({ ...settings, ...JSON.parse(storedSettings) })
      } catch (e) {
        console.error("Failed to parse stored settings", e)
      }
    }
  }, [])

  const handleSaveSettings = () => {
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Save settings to local storage
      localStorage.setItem("appopener_user_settings", JSON.stringify(settings))

      setLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been saved successfully.",
      })
    }, 800)
  }

  const handleResetSettings = () => {
    if (confirm("Are you sure you want to reset all settings to default values?")) {
      setSettings({
        email: "user@example.com",
        name: "John Doe",
        timezone: "UTC",
        emailNotifications: true,
        defaultRedirectDelay: 5,
        enableAnalytics: true,
        darkMode: false,
        defaultLinkExpiration: 0,
        autoGenerateQrCodes: true,
        customDomain: "",
        defaultCampaignDuration: 30,
        utmParameters: {
          defaultSource: "appopener",
          defaultMedium: "link",
        },
      })

      toast({
        title: "Settings reset",
        description: "All settings have been reset to default values.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleResetSettings} disabled={loading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <Tabs defaultValue="account">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="app">App</TabsTrigger>
          <TabsTrigger value="links">Links</TabsTrigger>
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
              <CardDescription>Manage your account details and preferences</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={settings.timezone}
                  onValueChange={(value) => setSettings({ ...settings, timezone: value })}
                >
                  <SelectTrigger id="timezone">
                    <SelectValue placeholder="Select timezone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UTC">UTC (Coordinated Universal Time)</SelectItem>
                    <SelectItem value="EST">EST (Eastern Standard Time)</SelectItem>
                    <SelectItem value="CST">CST (Central Standard Time)</SelectItem>
                    <SelectItem value="MST">MST (Mountain Standard Time)</SelectItem>
                    <SelectItem value="PST">PST (Pacific Standard Time)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive email notifications about your account and links</p>
                </div>
                <Switch
                  id="email-notifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => setSettings({ ...settings, emailNotifications: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="app" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>App Settings</CardTitle>
              <CardDescription>Customize how the application works for you</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="redirect-delay">Default Redirect Delay (seconds)</Label>
                <Input
                  id="redirect-delay"
                  type="number"
                  min="0"
                  max="30"
                  value={settings.defaultRedirectDelay}
                  onChange={(e) => setSettings({ ...settings, defaultRedirectDelay: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-500">
                  The number of seconds to wait before redirecting users to the destination URL
                </p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-analytics">Enable Analytics</Label>
                  <p className="text-sm text-gray-500">Collect and display analytics for your links and campaigns</p>
                </div>
                <Switch
                  id="enable-analytics"
                  checked={settings.enableAnalytics}
                  onCheckedChange={(checked) => setSettings({ ...settings, enableAnalytics: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">Dark Mode</Label>
                  <p className="text-sm text-gray-500">Use dark theme throughout the application</p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Link Settings</CardTitle>
              <CardDescription>Configure default settings for your shortened links</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="link-expiration">Default Link Expiration (days)</Label>
                <Input
                  id="link-expiration"
                  type="number"
                  min="0"
                  value={settings.defaultLinkExpiration}
                  onChange={(e) => setSettings({ ...settings, defaultLinkExpiration: Number(e.target.value) })}
                />
                <p className="text-xs text-gray-500">Number of days until links expire (0 = never expire)</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-qr">Auto-generate QR Codes</Label>
                  <p className="text-sm text-gray-500">Automatically generate QR codes for new links</p>
                </div>
                <Switch
                  id="auto-qr"
                  checked={settings.autoGenerateQrCodes}
                  onCheckedChange={(checked) => setSettings({ ...settings, autoGenerateQrCodes: checked })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="custom-domain">Custom Domain</Label>
                <Input
                  id="custom-domain"
                  placeholder="links.yourdomain.com"
                  value={settings.customDomain}
                  onChange={(e) => setSettings({ ...settings, customDomain: e.target.value })}
                />
                <p className="text-xs text-gray-500">
                  Use your own domain for shortened links (requires additional setup)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="campaigns" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>Configure default settings for your marketing campaigns</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-duration">Default Campaign Duration (days)</Label>
                <Input
                  id="campaign-duration"
                  type="number"
                  min="1"
                  value={settings.defaultCampaignDuration}
                  onChange={(e) => setSettings({ ...settings, defaultCampaignDuration: Number(e.target.value) })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-source">Default UTM Source</Label>
                <Input
                  id="utm-source"
                  value={settings.utmParameters.defaultSource}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      utmParameters: {
                        ...settings.utmParameters,
                        defaultSource: e.target.value,
                      },
                    })
                  }
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-medium">Default UTM Medium</Label>
                <Input
                  id="utm-medium"
                  value={settings.utmParameters.defaultMedium}
                  onChange={(e) =>
                    setSettings({
                      ...settings,
                      utmParameters: {
                        ...settings.utmParameters,
                        defaultMedium: e.target.value,
                      },
                    })
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
