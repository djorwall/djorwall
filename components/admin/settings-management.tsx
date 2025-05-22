"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Save, RefreshCw, Globe, Shield, Mail, BellRing, Server, UserCog, Link, QrCode, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function SettingsManagement() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("general")

  // Function to handle settings save
  const saveSettings = async () => {
    setIsLoading(true)

    // Simulating API call
    setTimeout(() => {
      setIsLoading(false)
      toast({
        title: "Settings saved",
        description: "Your settings have been successfully saved.",
      })
    }, 1000)
  }

  // Function to reset settings to defaults
  const resetSettings = () => {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all settings to their default values? This action cannot be undone.",
    )

    if (confirmReset) {
      setIsLoading(true)

      // Simulating API call
      setTimeout(() => {
        setIsLoading(false)
        toast({
          title: "Settings reset",
          description: "All settings have been reset to their default values.",
        })
      }, 1000)
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <div className="flex justify-between items-center">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-9 gap-1">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="notification" className="flex items-center gap-2">
              <BellRing className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Server className="h-4 w-4" />
              <span className="hidden sm:inline">API</span>
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <UserCog className="h-4 w-4" />
              <span className="hidden sm:inline">Users</span>
            </TabsTrigger>
            <TabsTrigger value="links" className="flex items-center gap-2">
              <Link className="h-4 w-4" />
              <span className="hidden sm:inline">Links</span>
            </TabsTrigger>
            <TabsTrigger value="qr" className="flex items-center gap-2">
              <QrCode className="h-4 w-4" />
              <span className="hidden sm:inline">QR Codes</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
          </TabsList>
        </div>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure the general settings for your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="site-name">Site Name</Label>
                    <Input id="site-name" defaultValue="AppOpener.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="site-url">Site URL</Label>
                    <Input id="site-url" defaultValue="https://appopener.io" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site-description">Site Description</Label>
                  <Textarea
                    id="site-description"
                    defaultValue="The ultimate URL shortener and QR code generator."
                    className="min-h-[80px]"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select defaultValue="UTC">
                      <SelectTrigger id="timezone">
                        <SelectValue placeholder="Select timezone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="UTC">UTC</SelectItem>
                        <SelectItem value="America/New_York">America/New York</SelectItem>
                        <SelectItem value="Europe/London">Europe/London</SelectItem>
                        <SelectItem value="Asia/Tokyo">Asia/Tokyo</SelectItem>
                        <SelectItem value="Australia/Sydney">Australia/Sydney</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="date-format">Date Format</Label>
                    <Select defaultValue="MM/DD/YYYY">
                      <SelectTrigger id="date-format">
                        <SelectValue placeholder="Select date format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                        <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                        <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-name">Company Name</Label>
                    <Input id="company-name" defaultValue="AppOpener Inc." />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-address">Company Address</Label>
                    <Input id="company-address" defaultValue="123 Tech Street, San Francisco, CA" />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company-email">Company Email</Label>
                    <Input id="company-email" defaultValue="contact@appopener.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company-phone">Company Phone</Label>
                    <Input id="company-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Branding</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="logo-url">Logo URL</Label>
                    <div className="flex gap-2 items-end">
                      <Input id="logo-url" defaultValue="/logo.png" className="flex-1" />
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="favicon-url">Favicon URL</Label>
                    <div className="flex gap-2 items-end">
                      <Input id="favicon-url" defaultValue="/favicon.ico" className="flex-1" />
                      <Button variant="outline" size="sm">
                        Upload
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex items-center gap-2">
                    <Input id="primary-color" defaultValue="#3b82f6" type="color" className="w-20 h-10 p-1" />
                    <Input defaultValue="#3b82f6" className="w-full" />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Application Settings</CardTitle>
              <CardDescription>Configure how the application behaves.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="maintenance-mode">Maintenance Mode</Label>
                  <p className="text-sm text-muted-foreground">
                    Put the site in maintenance mode to prevent user access
                  </p>
                </div>
                <Switch id="maintenance-mode" />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="debug-mode">Debug Mode</Label>
                  <p className="text-sm text-muted-foreground">Enable debug mode for detailed error messages</p>
                </div>
                <Switch id="debug-mode" />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label htmlFor="cache-ttl">Cache TTL (seconds)</Label>
                <Input id="cache-ttl" type="number" defaultValue="3600" />
                <p className="text-sm text-muted-foreground">Time to live for cached content in seconds</p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security settings for your application.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Authentication</h3>

                <div className="space-y-2">
                  <Label>Authentication Methods</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auth-email" defaultChecked />
                        <Label htmlFor="auth-email">Email/Password</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auth-google" defaultChecked />
                        <Label htmlFor="auth-google">Google</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auth-github" />
                        <Label htmlFor="auth-github">GitHub</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between space-x-2">
                      <div className="flex items-center space-x-2">
                        <Switch id="auth-apple" />
                        <Label htmlFor="auth-apple">Apple</Label>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="password-policy">Password Policy</Label>
                  <Select defaultValue="strong">
                    <SelectTrigger id="password-policy">
                      <SelectValue placeholder="Select password policy" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic (minimum 8 characters)</SelectItem>
                      <SelectItem value="medium">Medium (8+ chars, uppercase, lowercase)</SelectItem>
                      <SelectItem value="strong">Strong (8+ chars, upper, lower, number)</SelectItem>
                      <SelectItem value="very-strong">Very Strong (12+ chars, upper, lower, number, symbol)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                  <Input id="session-timeout" type="number" defaultValue="60" />
                  <p className="text-sm text-muted-foreground">Time in minutes before an inactive user is logged out</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Access Control</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                      <p className="text-sm text-muted-foreground">
                        Require two-factor authentication for admin accounts
                      </p>
                    </div>
                    <Switch id="two-factor" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="ip-restriction">IP Restriction</Label>
                      <p className="text-sm text-muted-foreground">Restrict admin access to specific IP addresses</p>
                    </div>
                    <Switch id="ip-restriction" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="allowed-ips">Allowed IP Addresses</Label>
                  <Textarea id="allowed-ips" placeholder="Enter IP addresses, one per line" className="min-h-[80px]" />
                  <p className="text-sm text-muted-foreground">Enter allowed IP addresses, one per line</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">CAPTCHA Settings</h3>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label htmlFor="enable-captcha">Enable CAPTCHA</Label>
                      <p className="text-sm text-muted-foreground">Protect forms with CAPTCHA verification</p>
                    </div>
                    <Switch id="enable-captcha" defaultChecked />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captcha-type">CAPTCHA Type</Label>
                  <Select defaultValue="recaptcha">
                    <SelectTrigger id="captcha-type">
                      <SelectValue placeholder="Select CAPTCHA type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recaptcha">Google reCAPTCHA</SelectItem>
                      <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                      <SelectItem value="custom">Custom CAPTCHA</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="captcha-site-key">Site Key</Label>
                    <Input id="captcha-site-key" defaultValue="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="captcha-secret-key">Secret Key</Label>
                    <Input
                      id="captcha-secret-key"
                      type="password"
                      defaultValue="6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Email Settings */}
        <TabsContent value="email" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Email Settings</CardTitle>
              <CardDescription>Configure email server settings and templates.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">SMTP Configuration</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-host">SMTP Host</Label>
                    <Input id="smtp-host" defaultValue="smtp.example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-port">SMTP Port</Label>
                    <Input id="smtp-port" defaultValue="587" />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="smtp-username">SMTP Username</Label>
                    <Input id="smtp-username" defaultValue="noreply@appopener.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="smtp-password">SMTP Password</Label>
                    <Input id="smtp-password" type="password" defaultValue="**********" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtp-encryption">SMTP Encryption</Label>
                  <Select defaultValue="tls">
                    <SelectTrigger id="smtp-encryption">
                      <SelectValue placeholder="Select encryption type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">None</SelectItem>
                      <SelectItem value="ssl">SSL</SelectItem>
                      <SelectItem value="tls">TLS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center space-x-2">
                  <Button variant="outline">Test Connection</Button>
                  <p className="text-sm text-muted-foreground">Send a test email to verify your SMTP settings</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Sender</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="from-email">From Email</Label>
                    <Input id="from-email" defaultValue="noreply@appopener.io" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="from-name">From Name</Label>
                    <Input id="from-name" defaultValue="AppOpener" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reply-to">Reply-To Email</Label>
                  <Input id="reply-to" defaultValue="support@appopener.io" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Email Templates</h3>

                <div className="space-y-2">
                  <Label>Available Templates</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Welcome Email</p>
                        <p className="text-sm text-muted-foreground">Sent to new users after registration</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Password Reset</p>
                        <p className="text-sm text-muted-foreground">Sent when a user requests a password reset</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Email Verification</p>
                        <p className="text-sm text-muted-foreground">Sent to verify a user's email address</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Subscription Confirmation</p>
                        <p className="text-sm text-muted-foreground">Sent after a successful subscription</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Settings</CardTitle>
              <CardDescription>Configure how and when notifications are sent.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Admin Notifications</h3>

                <div className="space-y-2">
                  <Label>Notification Channels</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-email" defaultChecked />
                      <Label htmlFor="admin-email">Email</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-sms" />
                      <Label htmlFor="admin-sms">SMS</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-slack" defaultChecked />
                      <Label htmlFor="admin-slack">Slack</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch id="admin-push" />
                      <Label htmlFor="admin-push">Push Notifications</Label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Notification Events</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-new-user">New User Registration</Label>
                        <p className="text-sm text-muted-foreground">Notify when a new user registers</p>
                      </div>
                      <Switch id="notify-new-user" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-new-subscription">New Subscription</Label>
                        <p className="text-sm text-muted-foreground">Notify when a user subscribes to a paid plan</p>
                      </div>
                      <Switch id="notify-new-subscription" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-subscription-cancel">Subscription Cancellation</Label>
                        <p className="text-sm text-muted-foreground">Notify when a user cancels their subscription</p>
                      </div>
                      <Switch id="notify-subscription-cancel" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-high-traffic">High Traffic Alert</Label>
                        <p className="text-sm text-muted-foreground">Notify when site traffic exceeds normal levels</p>
                      </div>
                      <Switch id="notify-high-traffic" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-error">System Error</Label>
                        <p className="text-sm text-muted-foreground">Notify when system errors occur</p>
                      </div>
                      <Switch id="notify-error" defaultChecked />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Notifications</h3>

                <div className="space-y-2">
                  <Label>Notification Events</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="user-notify-welcome">Welcome Email</Label>
                        <p className="text-sm text-muted-foreground">Send welcome email to new users</p>
                      </div>
                      <Switch id="user-notify-welcome" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="user-notify-link-click">Link Click Alerts</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users when their links reach milestone clicks
                        </p>
                      </div>
                      <Switch id="user-notify-link-click" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="user-notify-subscription">Subscription Updates</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users about subscription changes and renewals
                        </p>
                      </div>
                      <Switch id="user-notify-subscription" defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="user-notify-expiring-link">Expiring Links</Label>
                        <p className="text-sm text-muted-foreground">
                          Notify users when their links are about to expire
                        </p>
                      </div>
                      <Switch id="user-notify-expiring-link" />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Slack Integration</h3>

                <div className="space-y-2">
                  <Label htmlFor="slack-webhook">Slack Webhook URL</Label>
                  <Input
                    id="slack-webhook"
                    defaultValue="https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slack-channel">Slack Channel</Label>
                  <Input id="slack-channel" defaultValue="#app-notifications" />
                </div>

                <Button variant="outline">Test Slack Integration</Button>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* API Settings */}
        <TabsContent value="api" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>API Settings</CardTitle>
              <CardDescription>Configure API keys, rate limits, and integrations.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">API Access</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-api">Enable API</Label>
                    <p className="text-sm text-muted-foreground">Allow access to the API</p>
                  </div>
                  <Switch id="enable-api" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex gap-2">
                    <Input id="api-key" value="ap1_k3y_8d7f9s8df7sad98f7as9d8f7" readOnly className="flex-1" />
                    <Button variant="outline">Regenerate</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-secret">API Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="api-secret"
                      type="password"
                      value="ap1_s3cr3t_8d7f9s8df7sad98f7as9d8f7"
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="outline">Regenerate</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Rate Limiting</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-rate-limit">Enable Rate Limiting</Label>
                    <p className="text-sm text-muted-foreground">Limit the number of API requests per time period</p>
                  </div>
                  <Switch id="enable-rate-limit" defaultChecked />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit-requests">Max Requests</Label>
                    <Input id="rate-limit-requests" type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rate-limit-window">Time Window (seconds)</Label>
                    <Input id="rate-limit-window" type="number" defaultValue="60" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Integrations</h3>

                <div className="space-y-2">
                  <Label>Analytics Integrations</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Google Analytics</p>
                        <p className="text-sm text-muted-foreground">Integrate with Google Analytics</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Mixpanel</p>
                        <p className="text-sm text-muted-foreground">Integrate with Mixpanel</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Matomo</p>
                        <p className="text-sm text-muted-foreground">Integrate with Matomo</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Payment Integrations</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-muted-foreground">Integrate with Razorpay for payments</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-muted-foreground">Integrate with Stripe for payments</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">Integrate with PayPal for payments</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Webhooks</h3>

                <div className="space-y-2">
                  <Label htmlFor="webhook-url">Webhook Endpoint URL</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-url"
                      defaultValue="https://appopener.io/api/webhooks"
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="webhook-secret">Webhook Secret</Label>
                  <div className="flex gap-2">
                    <Input
                      id="webhook-secret"
                      type="password"
                      value="whsec_8d7f9s8df7sad98f7as9d8f7"
                      readOnly
                      className="flex-1"
                    />
                    <Button variant="outline">Regenerate</Button>
                    <Button variant="outline">Copy</Button>
                  </div>
                </div>

                <Alert className="bg-amber-50 border-amber-200">
                  <AlertDescription>
                    Regenerating your webhook secret will invalidate your previous secret. You will need to update your
                    integrations.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Users Settings */}
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>User Settings</CardTitle>
              <CardDescription>Configure user accounts, registration, and permissions.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Registration</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-registration">Enable User Registration</Label>
                    <p className="text-sm text-muted-foreground">Allow new users to register on the site</p>
                  </div>
                  <Switch id="enable-registration" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-verification">Require Email Verification</Label>
                    <p className="text-sm text-muted-foreground">New users must verify their email address</p>
                  </div>
                  <Switch id="email-verification" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="admin-approval">Require Admin Approval</Label>
                    <p className="text-sm text-muted-foreground">
                      New accounts require admin approval before activation
                    </p>
                  </div>
                  <Switch id="admin-approval" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-role">Default User Role</Label>
                  <Select defaultValue="user">
                    <SelectTrigger id="default-role">
                      <SelectValue placeholder="Select default role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">User</SelectItem>
                      <SelectItem value="premium">Premium User</SelectItem>
                      <SelectItem value="contributor">Contributor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Roles & Permissions</h3>

                <div className="space-y-2">
                  <Label>Available Roles</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Administrator</p>
                        <p className="text-sm text-muted-foreground">Full access to all features</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Permissions
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Manager</p>
                        <p className="text-sm text-muted-foreground">Can manage content but not settings</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Permissions
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Premium User</p>
                        <p className="text-sm text-muted-foreground">Access to premium features</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Permissions
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">User</p>
                        <p className="text-sm text-muted-foreground">Basic access to the platform</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Edit Permissions
                      </Button>
                    </div>
                  </div>
                </div>

                <Button variant="outline">Create New Role</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">User Limits</h3>

                <div className="space-y-2">
                  <Label htmlFor="free-tier-links">Free Tier Link Limit</Label>
                  <Input id="free-tier-links" type="number" defaultValue="50" />
                  <p className="text-sm text-muted-foreground">Maximum number of links allowed for free users</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="free-tier-qr">Free Tier QR Code Limit</Label>
                  <Input id="free-tier-qr" type="number" defaultValue="10" />
                  <p className="text-sm text-muted-foreground">Maximum number of QR codes allowed for free users</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="inactive-days">Account Inactivity Threshold (days)</Label>
                  <Input id="inactive-days" type="number" defaultValue="90" />
                  <p className="text-sm text-muted-foreground">
                    Number of days before an account is considered inactive
                  </p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Links Settings */}
        <TabsContent value="links" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Link Settings</CardTitle>
              <CardDescription>Configure link behavior, analytics, and defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Link Generation</h3>

                <div className="space-y-2">
                  <Label htmlFor="default-domain">Default Domain</Label>
                  <Input id="default-domain" defaultValue="app.io" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug-length">Default Slug Length</Label>
                  <Input id="slug-length" type="number" defaultValue="6" />
                  <p className="text-sm text-muted-foreground">Length of randomly generated slugs</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="slug-charset">Slug Character Set</Label>
                  <Select defaultValue="alphanumeric">
                    <SelectTrigger id="slug-charset">
                      <SelectValue placeholder="Select character set" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alphanumeric">Alphanumeric (a-z, 0-9)</SelectItem>
                      <SelectItem value="alphabetic">Alphabetic (a-z)</SelectItem>
                      <SelectItem value="numeric">Numeric (0-9)</SelectItem>
                      <SelectItem value="alphanumeric-special">Alphanumeric + Special Characters</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-custom-slugs">Allow Custom Slugs</Label>
                    <p className="text-sm text-muted-foreground">Allow users to create custom slugs for their links</p>
                  </div>
                  <Switch id="enable-custom-slugs" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-custom-domains">Allow Custom Domains</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to use their own domains for shortened links
                    </p>
                  </div>
                  <Switch id="enable-custom-domains" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Link Behavior</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-expiration">Enable Link Expiration</Label>
                    <p className="text-sm text-muted-foreground">Allow links to expire after a certain period</p>
                  </div>
                  <Switch id="enable-expiration" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="default-expiration">Default Expiration (days)</Label>
                  <Input id="default-expiration" type="number" defaultValue="365" />
                  <p className="text-sm text-muted-foreground">
                    Default number of days until a link expires (0 = never expires)
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-password">Allow Password Protection</Label>
                    <p className="text-sm text-muted-foreground">Allow links to be protected with a password</p>
                  </div>
                  <Switch id="enable-password" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-geo-targeting">Enable Geo-Targeting</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow links to redirect to different URLs based on location
                    </p>
                  </div>
                  <Switch id="enable-geo-targeting" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="enable-device-targeting">Enable Device Targeting</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow links to redirect to different URLs based on device
                    </p>
                  </div>
                  <Switch id="enable-device-targeting" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Analytics</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="track-clicks">Track Link Clicks</Label>
                    <p className="text-sm text-muted-foreground">Track the number of clicks on each link</p>
                  </div>
                  <Switch id="track-clicks" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="track-location">Track User Location</Label>
                    <p className="text-sm text-muted-foreground">Track the location of users who click on links</p>
                  </div>
                  <Switch id="track-location" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="track-device">Track User Device</Label>
                    <p className="text-sm text-muted-foreground">Track the device type of users who click on links</p>
                  </div>
                  <Switch id="track-device" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="track-referrer">Track Referrer</Label>
                    <p className="text-sm text-muted-foreground">Track the referrer URL of users who click on links</p>
                  </div>
                  <Switch id="track-referrer" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="analytics-retention">Analytics Data Retention (days)</Label>
                  <Input id="analytics-retention" type="number" defaultValue="365" />
                  <p className="text-sm text-muted-foreground">Number of days to retain analytics data</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* QR Codes Settings */}
        <TabsContent value="qr" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>QR Code Settings</CardTitle>
              <CardDescription>Configure QR code generation and defaults.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">QR Code Generation</h3>

                <div className="space-y-2">
                  <Label htmlFor="qr-default-size">Default Size (pixels)</Label>
                  <Input id="qr-default-size" type="number" defaultValue="300" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-error-correction">Error Correction Level</Label>
                  <Select defaultValue="M">
                    <SelectTrigger id="qr-error-correction">
                      <SelectValue placeholder="Select error correction level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-muted-foreground">
                    Higher levels make QR codes more resistant to damage but increase complexity
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="qr-foreground">Default Foreground Color</Label>
                    <div className="flex items-center gap-2">
                      <Input id="qr-foreground" defaultValue="#000000" type="color" className="w-20 h-10 p-1" />
                      <Input defaultValue="#000000" className="w-full" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="qr-background">Default Background Color</Label>
                    <div className="flex items-center gap-2">
                      <Input id="qr-background" defaultValue="#FFFFFF" type="color" className="w-20 h-10 p-1" />
                      <Input defaultValue="#FFFFFF" className="w-full" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qr-allow-logo">Allow Logo Embedding</Label>
                    <p className="text-sm text-muted-foreground">Allow users to embed logos in QR codes</p>
                  </div>
                  <Switch id="qr-allow-logo" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qr-allow-custom">Allow Custom QR Designs</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow users to customize QR code designs with shapes and colors
                    </p>
                  </div>
                  <Switch id="qr-allow-custom" defaultChecked />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">QR Code Templates</h3>

                <div className="space-y-2">
                  <Label>Available Templates</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Standard</p>
                        <p className="text-sm text-muted-foreground">Basic QR code design</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Rounded</p>
                        <p className="text-sm text-muted-foreground">QR code with rounded corners</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Dots</p>
                        <p className="text-sm text-muted-foreground">QR code with dots pattern</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Gradient</p>
                        <p className="text-sm text-muted-foreground">QR code with gradient colors</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                </div>

                <Button variant="outline">Add New Template</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Dynamic QR Codes</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qr-dynamic">Enable Dynamic QR Codes</Label>
                    <p className="text-sm text-muted-foreground">
                      Allow creating QR codes that can be updated after creation
                    </p>
                  </div>
                  <Switch id="qr-dynamic" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="qr-analytics">Track QR Code Scans</Label>
                    <p className="text-sm text-muted-foreground">Collect analytics data for QR code scans</p>
                  </div>
                  <Switch id="qr-analytics" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="qr-scan-retention">Scan Analytics Retention (days)</Label>
                  <Input id="qr-scan-retention" type="number" defaultValue="365" />
                  <p className="text-sm text-muted-foreground">Number of days to retain QR code scan analytics</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Billing Settings</CardTitle>
              <CardDescription>Configure subscription plans and payment settings.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Subscription Plans</h3>

                <div className="space-y-2">
                  <Label>Available Plans</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Free</p>
                        <p className="text-sm text-muted-foreground">Basic functionality with limited features</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pro ($9.99/month)</p>
                        <p className="text-sm text-muted-foreground">Advanced features for professionals</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Business ($29.99/month)</p>
                        <p className="text-sm text-muted-foreground">Team collaboration and advanced analytics</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Enterprise (Custom)</p>
                        <p className="text-sm text-muted-foreground">Custom solutions for large organizations</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <Button variant="outline">Add New Plan</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Payment Gateways</h3>

                <div className="space-y-2">
                  <Label>Activated Payment Gateways</Label>
                  <div className="grid grid-cols-1 gap-4 pt-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Razorpay</p>
                        <p className="text-sm text-muted-foreground">Primary payment gateway</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Connected
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Stripe</p>
                        <p className="text-sm text-muted-foreground">Secondary payment gateway</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">PayPal</p>
                        <p className="text-sm text-muted-foreground">Alternative payment method</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Connect
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-lg font-medium">Billing Options</h3>

                <div className="space-y-2">
                  <Label htmlFor="currency">Default Currency</Label>
                  <Select defaultValue="USD">
                    <SelectTrigger id="currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">USD ($)</SelectItem>
                      <SelectItem value="EUR">EUR (€)</SelectItem>
                      <SelectItem value="GBP">GBP (£)</SelectItem>
                      <SelectItem value="INR">INR (₹)</SelectItem>
                      <SelectItem value="JPY">JPY (¥)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="tax-enabled">Enable Tax Collection</Label>
                    <p className="text-sm text-muted-foreground">Collect and calculate tax on invoices</p>
                  </div>
                  <Switch id="tax-enabled" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tax-rate">Default Tax Rate (%)</Label>
                  <Input id="tax-rate" type="number" defaultValue="18" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="invoice-generation">Automatic Invoice Generation</Label>
                    <p className="text-sm text-muted-foreground">Automatically generate invoices for payments</p>
                  </div>
                  <Switch id="invoice-generation" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="proration-enabled">Enable Proration</Label>
                    <p className="text-sm text-muted-foreground">Prorate subscription changes mid-billing cycle</p>
                  </div>
                  <Switch id="proration-enabled" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" onClick={resetSettings} disabled={isLoading}>
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset to Defaults
              </Button>
              <Button onClick={saveSettings} disabled={isLoading}>
                {isLoading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
