import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdsPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Ad Management</h1>

      <Tabs defaultValue="adsense" className="space-y-6">
        <TabsList>
          <TabsTrigger value="adsense">AdSense</TabsTrigger>
          <TabsTrigger value="custom">Custom HTML</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="adsense" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Google AdSense</CardTitle>
              <CardDescription>Configure Google AdSense for redirect pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="adsense-id">AdSense Publisher ID</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <div className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm">
                      <span className="text-muted-foreground">ca-pub-</span>
                      <input
                        id="adsense-id"
                        className="flex-1 border-0 bg-transparent p-0 outline-none placeholder:text-muted-foreground"
                        placeholder="1234567890123456"
                      />
                    </div>
                  </div>
                  <Button variant="outline">Verify</Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-slot">Ad Slot ID</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id="ad-slot"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                      placeholder="1234567890"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-format">Ad Format</Label>
                <Select defaultValue="responsive">
                  <SelectTrigger id="ad-format">
                    <SelectValue placeholder="Select ad format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="responsive">Responsive</SelectItem>
                    <SelectItem value="banner">Banner (728x90)</SelectItem>
                    <SelectItem value="large-rectangle">Large Rectangle (336x280)</SelectItem>
                    <SelectItem value="medium-rectangle">Medium Rectangle (300x250)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="auto-ads">Enable Auto Ads</Label>
                  <p className="text-sm text-muted-foreground">Let Google automatically place ads on your pages</p>
                </div>
                <Switch id="auto-ads" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="custom" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Custom HTML Ads</CardTitle>
              <CardDescription>Add custom HTML ad code to redirect pages</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="custom-ad-code">Custom Ad Code</Label>
                <Textarea
                  id="custom-ad-code"
                  placeholder="Paste your ad code here..."
                  className="min-h-[200px] font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">Paste your ad network code or custom HTML here</p>
              </div>

              <div className="p-4 border rounded-md bg-secondary/50">
                <h3 className="text-sm font-medium mb-2">Ad Preview</h3>
                <div className="h-24 bg-gray-200 rounded flex items-center justify-center">
                  <p className="text-muted-foreground">Ad preview will appear here</p>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Ad Settings</CardTitle>
              <CardDescription>Configure global ad settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-ads">Enable Ads</Label>
                  <p className="text-sm text-muted-foreground">Show ads on redirect pages</p>
                </div>
                <Switch id="enable-ads" defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="premium-ads">Hide Ads for Premium Users</Label>
                  <p className="text-sm text-muted-foreground">Premium users won't see ads on redirect pages</p>
                </div>
                <Switch id="premium-ads" defaultChecked />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ad-refresh">Ad Refresh Rate (seconds)</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <input
                      id="ad-refresh"
                      type="number"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none"
                      placeholder="30"
                      defaultValue="30"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Set to 0 to disable auto-refresh</p>
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
