"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { AgentDashboardHeader } from "@/components/dashboard/agent-dashboard-header"
import { InfluencerCard } from "@/components/dashboard/influencer-card"
import { useAuth } from "@/contexts/auth-context"
import { addInfluencerToSheet, createSheet, type InfluencerData } from "@/lib/sheet-service"

export default function NewSheetPage() {
  const { user, profile, isLoading } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState("details")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sheet details
  const [sheetName, setSheetName] = useState("")
  const [sheetDescription, setSheetDescription] = useState("")
  const [sheetCategory, setSheetCategory] = useState("")
  const [accessType, setAccessType] = useState("public")
  const [password, setPassword] = useState("")

  // Influencers
  const [socialMediaLink, setSocialMediaLink] = useState("")
  const [influencers, setInfluencers] = useState<InfluencerData[]>([])
  const [newSheetId, setNewSheetId] = useState<string | null>(null)

  // Check if user is logged in and is an agent
  if (!isLoading && (!user || profile?.role !== "agent")) {
    router.push("/login?role=agent")
    return null
  }

  const handleAddInfluencer = () => {
    if (!socialMediaLink || !newSheetId) return

    // Extract platform from link
    let platform: "Instagram" | "TikTok" | "YouTube" | "Twitter" | "Other" = "Other"
    if (socialMediaLink.includes("instagram")) {
      platform = "Instagram"
    } else if (socialMediaLink.includes("tiktok")) {
      platform = "TikTok"
    } else if (socialMediaLink.includes("youtube")) {
      platform = "YouTube"
    } else if (socialMediaLink.includes("twitter")) {
      platform = "Twitter"
    }

    // Extract handle from link
    const urlParts = socialMediaLink.split("/")
    const handle = urlParts[urlParts.length - 1] || `@user${Math.floor(Math.random() * 1000)}`

    // Create new influencer
    const newInfluencer: InfluencerData = {
      sheetId: newSheetId,
      name: handle.replace("@", ""),
      handle: handle.startsWith("@") ? handle : `@${handle}`,
      platform,
      followers: "0",
      category: sheetCategory || "Other",
      imageUrl: `/placeholder.svg?height=200&width=200&query=${platform} influencer ${handle}`,
      engagement: "0%",
      pricing: [
        { type: "story", price: "$0" },
        { type: "post", price: "$0" },
        { type: "reel", price: "$0" },
        { type: "video", price: "$0" },
      ],
    }

    // Add to database
    addInfluencerToSheet(newInfluencer)
      .then(({ influencer, error }) => {
        if (error) {
          toast.error("Failed to add influencer", {
            description: error.message,
          })
          return
        }

        // Add to local state
        setInfluencers([...influencers, { ...newInfluencer, id: influencer.id }])
        setSocialMediaLink("")

        toast.success("Influencer added", {
          description: `${newInfluencer.name} has been added to your sheet`,
        })
      })
      .catch((error) => {
        console.error("Add influencer error:", error)
        toast.error("An unexpected error occurred")
      })
  }

  const handleRemoveInfluencer = (id: string) => {
    setInfluencers(influencers.filter((influencer) => influencer.id !== id))
  }

  const handleSaveDetails = async () => {
    if (!user) return

    if (!sheetName) {
      toast.error("Sheet name is required")
      return
    }

    setIsSubmitting(true)

    try {
      const { sheet, error } = await createSheet(user.id, {
        name: sheetName,
        description: sheetDescription,
        accessType: accessType as any,
        password: accessType === "password" ? password : undefined,
        categories: sheetCategory ? [sheetCategory] : [],
      })

      if (error) {
        toast.error("Failed to create sheet", {
          description: error.message,
        })
        setIsSubmitting(false)
        return
      }

      setNewSheetId(sheet.id)
      toast.success("Sheet details saved")
      setActiveTab("influencers")
    } catch (error) {
      console.error("Create sheet error:", error)
      toast.error("An unexpected error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handlePublishSheet = () => {
    if (!newSheetId) return

    toast.success("Sheet published successfully")
    router.push(`/sheets/${newSheetId}`)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <AgentDashboardHeader />
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/dashboard/agent/sheets">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Sheets
            </Link>
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Create New Sheet</h2>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="details">Sheet Details</TabsTrigger>
            <TabsTrigger value="influencers" disabled={!newSheetId}>
              Add Influencers
            </TabsTrigger>
            <TabsTrigger value="privacy" disabled={!newSheetId}>
              Privacy Settings
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={!newSheetId}>
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sheet Information</CardTitle>
                <CardDescription>Enter the basic information for your influencer sheet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sheet-name">Sheet Name</Label>
                  <Input
                    id="sheet-name"
                    placeholder="e.g., Fashion Influencers 2024"
                    value={sheetName}
                    onChange={(e) => setSheetName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-description">Description (Optional)</Label>
                  <Textarea
                    id="sheet-description"
                    placeholder="Add a description for your sheet"
                    value={sheetDescription}
                    onChange={(e) => setSheetDescription(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sheet-category">Primary Category</Label>
                  <Select value={sheetCategory} onValueChange={setSheetCategory}>
                    <SelectTrigger id="sheet-category">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="beauty">Beauty</SelectItem>
                      <SelectItem value="tech">Tech</SelectItem>
                      <SelectItem value="gaming">Gaming</SelectItem>
                      <SelectItem value="food">Food</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="fitness">Fitness</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="mt-4" onClick={handleSaveDetails} disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save & Continue"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="influencers" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Add Influencers</CardTitle>
                <CardDescription>
                  Add influencers to your sheet by pasting their social media profile links
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Paste Instagram, TikTok, or YouTube profile link"
                      value={socialMediaLink}
                      onChange={(e) => setSocialMediaLink(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAddInfluencer}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="mb-4 text-lg font-medium">Influencers in this sheet ({influencers.length})</h3>
                  {influencers.length === 0 ? (
                    <div className="rounded-md border p-8 text-center">
                      <p className="text-muted-foreground">
                        No influencers added yet. Paste a social media profile link above to add your first influencer.
                      </p>
                    </div>
                  ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {influencers.map((influencer) => (
                        <div key={influencer.id} className="relative">
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute -right-2 -top-2 z-10 h-6 w-6"
                            onClick={() => handleRemoveInfluencer(influencer.id!)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                          <InfluencerCard
                            influencer={{
                              id: influencer.id!,
                              name: influencer.name,
                              handle: influencer.handle,
                              platform: influencer.platform,
                              followers: influencer.followers,
                              category: influencer.category,
                              image: influencer.imageUrl || "/placeholder.svg",
                              engagement: influencer.engagement || "0%",
                              pricing: influencer.pricing.reduce(
                                (acc, curr) => {
                                  acc[curr.type] = curr.price
                                  return acc
                                },
                                {} as Record<string, string>,
                              ),
                            }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <Button className="mt-4" onClick={() => setActiveTab("privacy")}>
                  Continue to Privacy Settings
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Privacy Settings</CardTitle>
                <CardDescription>Control who can access your influencer sheet</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="access-type">Access Type</Label>
                  <Select value={accessType} onValueChange={setAccessType}>
                    <SelectTrigger id="access-type">
                      <SelectValue placeholder="Select access type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public (All registered users)</SelectItem>
                      <SelectItem value="password">Password Protected</SelectItem>
                      <SelectItem value="request">Request Access</SelectItem>
                      <SelectItem value="one-time">One-Time View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {accessType === "password" && (
                  <div className="space-y-2">
                    <Label htmlFor="sheet-password">Password</Label>
                    <Input
                      id="sheet-password"
                      type="password"
                      placeholder="Enter a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label>Tracking Options</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="track-ip" defaultChecked />
                      <Label htmlFor="track-ip">Track IP Address</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="track-viewer" defaultChecked />
                      <Label htmlFor="track-viewer">Track Viewer Name</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="track-timestamp" defaultChecked />
                      <Label htmlFor="track-timestamp">Track Timestamp</Label>
                    </div>
                  </div>
                </div>

                <Button className="mt-4" onClick={() => setActiveTab("preview")}>
                  Continue to Preview
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Sheet Preview</CardTitle>
                <CardDescription>Preview how your sheet will appear to viewers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold">{sheetName || "Untitled Sheet"}</h3>
                    {sheetDescription && <p className="text-muted-foreground">{sheetDescription}</p>}
                  </div>

                  <div>
                    <h4 className="mb-4 text-lg font-medium">Influencers ({influencers.length})</h4>
                    {influencers.length === 0 ? (
                      <div className="rounded-md border p-8 text-center">
                        <p className="text-muted-foreground">
                          No influencers added yet. Go back to the "Add Influencers" tab to add some.
                        </p>
                      </div>
                    ) : (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {influencers.map((influencer) => (
                          <InfluencerCard
                            key={influencer.id}
                            influencer={{
                              id: influencer.id!,
                              name: influencer.name,
                              handle: influencer.handle,
                              platform: influencer.platform,
                              followers: influencer.followers,
                              category: influencer.category,
                              image: influencer.imageUrl || "/placeholder.svg",
                              engagement: influencer.engagement || "0%",
                              pricing: influencer.pricing.reduce(
                                (acc, curr) => {
                                  acc[curr.type] = curr.price
                                  return acc
                                },
                                {} as Record<string, string>,
                              ),
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" onClick={() => router.push("/dashboard/agent")}>
                Save as Draft
              </Button>
              <Button onClick={handlePublishSheet}>Publish Sheet</Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
