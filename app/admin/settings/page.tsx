import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="advanced">Advanced</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
              <CardDescription>Configure basic platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="site-name">Site Name</Label>
                <Input id="site-name" defaultValue="Appopener.io" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="site-url">Site URL</Label>
                <Input id="site-url" defaultValue="https://appopener.io" />
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Link Creation</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="anonymous-links">Anonymous Link Creation</Label>
                    <p className="text-sm text-muted-foreground">Allow users to create links without logging in</p>
                  </div>
                  <Switch id="anonymous-links" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="require-captcha">Require Captcha</Label>
                    <p className="text-sm text-muted-foreground">Require captcha verification for link creation</p>
                  </div>
                  <Switch id="require-captcha" defaultChecked />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Settings</CardTitle>
              <CardDescription>Configure security and access settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="captcha-anonymous">Captcha for Anonymous Users</Label>
                    <p className="text-sm text-muted-foreground">Require captcha verification for anonymous users</p>
                  </div>
                  <Switch id="captcha-anonymous" defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="captcha-logged-in">Captcha for Logged-in Users</Label>
                    <p className="text-sm text-muted-foreground">Require captcha verification for logged-in users</p>
                  </div>
                  <Switch id="captcha-logged-in" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="captcha-provider">Captcha Provider</Label>
                  <Select defaultValue="recaptcha">
                    <SelectTrigger id="captcha-provider">
                      <SelectValue placeholder="Select provider" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recaptcha">Google reCAPTCHA</SelectItem>
                      <SelectItem value="hcaptcha">hCaptcha</SelectItem>
                      <SelectItem value="turnstile">Cloudflare Turnstile</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Rate Limiting</h3>

                <div className="space-y-2">
                  <Label htmlFor="click-limit">Click Limit per Link</Label>
                  <Input id="click-limit" type="number" defaultValue="0" />
                  <p className="text-xs text-muted-foreground">Set to 0 for unlimited clicks</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="creation-limit">Link Creation Limit</Label>
                  <Input id="creation-limit" type="number" defaultValue="100" />
                  <p className="text-xs text-muted-foreground">Maximum links per user per day</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="appearance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>Customize the look and feel of the platform</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="theme">Theme</Label>
                <Select defaultValue="light">
                  <SelectTrigger id="theme">
                    <SelectValue placeholder="Select theme" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Light</SelectItem>
                    <SelectItem value="dark">Dark</SelectItem>
                    <SelectItem value="system">System</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="primary-color">Primary Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="primary-color" defaultValue="#007BFF" />
                  <div className="w-10 h-10 rounded-md bg-primary" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accent-color">Accent Color</Label>
                <div className="flex items-center gap-2">
                  <Input id="accent-color" defaultValue="#28A745" />
                  <div className="w-10 h-10 rounded-md bg-accent" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Advanced Settings</CardTitle>
              <CardDescription>Configure advanced platform settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Redirect Settings</h3>

                <div className="space-y-2">
                  <Label htmlFor="countdown-timer">Default Countdown Timer (seconds)</Label>
                  <Input id="countdown-timer" type="number" defaultValue="5" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="show-ads">Show Ads on Redirect Page</Label>
                    <p className="text-sm text-muted-foreground">Display advertisements on the redirect page</p>
                  </div>
                  <Switch id="show-ads" defaultChecked />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="button-text">Default Button Text</Label>
                  <Input id="button-text" defaultValue="GO" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Fallback Behavior</h3>

                <div className="space-y-2">
                  <Label htmlFor="fallback-behavior">Default Fallback</Label>
                  <Select defaultValue="web">
                    <SelectTrigger id="fallback-behavior">
                      <SelectValue placeholder="Select fallback behavior" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="web">Web URL</SelectItem>
                      <SelectItem value="store">App Store</SelectItem>
                      <SelectItem value="custom">Custom URL</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
