"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd"
import { Plus, Trash2, Settings, MoveVertical, Save, Eye, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

// Mock component types for the builder
const componentTypes = [
  { id: "header", name: "Header", icon: "🎯" },
  { id: "hero", name: "Hero Section", icon: "🦸" },
  { id: "features", name: "Features", icon: "✨" },
  { id: "testimonials", name: "Testimonials", icon: "💬" },
  { id: "pricing", name: "Pricing", icon: "💰" },
  { id: "cta", name: "Call to Action", icon: "🔔" },
  { id: "form", name: "Form", icon: "📝" },
  { id: "faq", name: "FAQ", icon: "❓" },
  { id: "gallery", name: "Image Gallery", icon: "🖼️" },
  { id: "video", name: "Video", icon: "🎬" },
  { id: "countdown", name: "Countdown", icon: "⏱️" },
  { id: "footer", name: "Footer", icon: "👣" },
]

// Mock initial sections for a new page
const initialSections = [
  {
    id: "header-1",
    type: "header",
    content: {
      logo: "/logo.svg",
      navigation: [
        { label: "Home", url: "#" },
        { label: "Features", url: "#features" },
        { label: "Pricing", url: "#pricing" },
        { label: "Contact", url: "#contact" },
      ],
      cta: { label: "Get Started", url: "#" },
    },
  },
  {
    id: "hero-1",
    type: "hero",
    content: {
      headline: "Welcome to Our Amazing Product",
      subheadline: "The best solution for your needs",
      description:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam euismod, nisl eget aliquam ultricies.",
      image: "/placeholder.svg?height=400&width=600&query=product+showcase",
      cta: { primary: { label: "Get Started", url: "#" }, secondary: { label: "Learn More", url: "#" } },
    },
  },
  {
    id: "features-1",
    type: "features",
    content: {
      headline: "Key Features",
      features: [
        { title: "Easy to Use", description: "Simple and intuitive interface", icon: "✨" },
        { title: "Powerful", description: "Advanced capabilities for power users", icon: "💪" },
        { title: "Secure", description: "Enterprise-grade security built-in", icon: "🔒" },
      ],
    },
  },
  {
    id: "cta-1",
    type: "cta",
    content: {
      headline: "Ready to Get Started?",
      description: "Join thousands of satisfied customers today.",
      button: { label: "Sign Up Now", url: "#" },
      background: "gradient",
    },
  },
]

export function LandingPageBuilder({ initialData = null }: { initialData?: any }) {
  const [sections, setSections] = useState(initialData?.sections || initialSections)
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null)
  const [pageSettings, setPageSettings] = useState({
    title: initialData?.title || "New Landing Page",
    description: initialData?.description || "A beautiful landing page",
    keywords: initialData?.keywords || "landing page, marketing",
    ogImage: initialData?.ogImage || "",
    favicon: initialData?.favicon || "",
    customCSS: initialData?.customCSS || "",
    customJS: initialData?.customJS || "",
    googleAnalyticsId: initialData?.googleAnalyticsId || "",
    facebookPixelId: initialData?.facebookPixelId || "",
    showCookieBanner: initialData?.showCookieBanner || true,
  })

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const items = Array.from(sections)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    setSections(items)
  }

  const handleAddSection = (type: string) => {
    const newSection = {
      id: `${type}-${Date.now()}`,
      type,
      content: getDefaultContentForType(type),
    }

    setSections([...sections, newSection])
  }

  const handleDeleteSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id))
    if (activeSectionId === id) {
      setActiveSectionId(null)
    }
  }

  const handleUpdateSectionContent = (id: string, content: any) => {
    setSections(sections.map((section) => (section.id === id ? { ...section, content } : section)))
  }

  const getDefaultContentForType = (type: string) => {
    switch (type) {
      case "header":
        return {
          logo: "/logo.svg",
          navigation: [
            { label: "Home", url: "#" },
            { label: "Features", url: "#features" },
            { label: "Pricing", url: "#pricing" },
            { label: "Contact", url: "#contact" },
          ],
          cta: { label: "Get Started", url: "#" },
        }
      case "hero":
        return {
          headline: "Welcome to Our Product",
          subheadline: "The best solution for your needs",
          description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
          image: "/placeholder.svg?height=400&width=600&query=product+showcase",
          cta: { primary: { label: "Get Started", url: "#" }, secondary: { label: "Learn More", url: "#" } },
        }
      case "features":
        return {
          headline: "Key Features",
          features: [
            { title: "Feature 1", description: "Description 1", icon: "✨" },
            { title: "Feature 2", description: "Description 2", icon: "💪" },
            { title: "Feature 3", description: "Description 3", icon: "🔒" },
          ],
        }
      case "testimonials":
        return {
          headline: "What Our Customers Say",
          testimonials: [
            {
              quote: "This product changed my life!",
              author: "John Doe",
              position: "CEO, Company",
              avatar: "/placeholder.svg?height=100&width=100&query=person",
            },
            {
              quote: "Incredible service and support!",
              author: "Jane Smith",
              position: "Designer",
              avatar: "/placeholder.svg?height=100&width=100&query=person",
            },
          ],
        }
      case "cta":
        return {
          headline: "Ready to Get Started?",
          description: "Join thousands of satisfied customers today.",
          button: { label: "Sign Up Now", url: "#" },
          background: "gradient",
        }
      default:
        return {}
    }
  }

  const renderSectionPreview = (section: any) => {
    switch (section.type) {
      case "header":
        return (
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <div className="font-bold">Logo</div>
              <div className="flex space-x-4">
                {section.content.navigation.map((item: any, index: number) => (
                  <div key={index} className="text-sm">
                    {item.label}
                  </div>
                ))}
                <Button size="sm">{section.content.cta.label}</Button>
              </div>
            </div>
          </div>
        )
      case "hero":
        return (
          <div className="p-6 text-center">
            <h1 className="text-2xl font-bold mb-2">{section.content.headline}</h1>
            <p className="text-sm mb-4">{section.content.subheadline}</p>
            <p className="text-xs mb-4">{section.content.description}</p>
            <div className="flex justify-center space-x-2">
              <Button size="sm">{section.content.cta.primary.label}</Button>
              <Button size="sm" variant="outline">
                {section.content.cta.secondary.label}
              </Button>
            </div>
          </div>
        )
      case "features":
        return (
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4 text-center">{section.content.headline}</h2>
            <div className="grid grid-cols-3 gap-4">
              {section.content.features.map((feature: any, index: number) => (
                <div key={index} className="text-center p-2">
                  <div className="text-2xl mb-2">{feature.icon}</div>
                  <h3 className="font-medium">{feature.title}</h3>
                  <p className="text-xs">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )
      case "cta":
        return (
          <div className="p-6 text-center bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <h2 className="text-xl font-bold mb-2">{section.content.headline}</h2>
            <p className="text-sm mb-4">{section.content.description}</p>
            <Button size="sm" variant="secondary">
              {section.content.button.label}
            </Button>
          </div>
        )
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">
            {section.type.charAt(0).toUpperCase() + section.type.slice(1)} Section
          </div>
        )
    }
  }

  const renderSectionEditor = (section: any) => {
    switch (section.type) {
      case "header":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="logo">Logo URL</Label>
              <Input
                id="logo"
                value={section.content.logo}
                onChange={(e) => handleUpdateSectionContent(section.id, { ...section.content, logo: e.target.value })}
              />
            </div>
            <div>
              <Label>Navigation</Label>
              {section.content.navigation.map((item: any, index: number) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    placeholder="Label"
                    value={item.label}
                    onChange={(e) => {
                      const newNavigation = [...section.content.navigation]
                      newNavigation[index].label = e.target.value
                      handleUpdateSectionContent(section.id, { ...section.content, navigation: newNavigation })
                    }}
                  />
                  <Input
                    placeholder="URL"
                    value={item.url}
                    onChange={(e) => {
                      const newNavigation = [...section.content.navigation]
                      newNavigation[index].url = e.target.value
                      handleUpdateSectionContent(section.id, { ...section.content, navigation: newNavigation })
                    }}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const newNavigation = [...section.content.navigation]
                      newNavigation.splice(index, 1)
                      handleUpdateSectionContent(section.id, { ...section.content, navigation: newNavigation })
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newNavigation = [...section.content.navigation, { label: "New Item", url: "#" }]
                  handleUpdateSectionContent(section.id, { ...section.content, navigation: newNavigation })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Item
              </Button>
            </div>
            <div>
              <Label htmlFor="cta-label">CTA Button</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="cta-label"
                  placeholder="Label"
                  value={section.content.cta.label}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: { ...section.content.cta, label: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="URL"
                  value={section.content.cta.url}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: { ...section.content.cta, url: e.target.value },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )
      case "hero":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="headline">Headline</Label>
              <Input
                id="headline"
                value={section.content.headline}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, headline: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="subheadline">Subheadline</Label>
              <Input
                id="subheadline"
                value={section.content.subheadline}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, subheadline: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={section.content.description}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="image">Image URL</Label>
              <Input
                id="image"
                value={section.content.image}
                onChange={(e) => handleUpdateSectionContent(section.id, { ...section.content, image: e.target.value })}
              />
            </div>
            <div>
              <Label>Primary CTA</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Label"
                  value={section.content.cta.primary.label}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: {
                        ...section.content.cta,
                        primary: { ...section.content.cta.primary, label: e.target.value },
                      },
                    })
                  }
                />
                <Input
                  placeholder="URL"
                  value={section.content.cta.primary.url}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: {
                        ...section.content.cta,
                        primary: { ...section.content.cta.primary, url: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label>Secondary CTA</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Label"
                  value={section.content.cta.secondary.label}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: {
                        ...section.content.cta,
                        secondary: { ...section.content.cta.secondary, label: e.target.value },
                      },
                    })
                  }
                />
                <Input
                  placeholder="URL"
                  value={section.content.cta.secondary.url}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      cta: {
                        ...section.content.cta,
                        secondary: { ...section.content.cta.secondary, url: e.target.value },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        )
      case "features":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="features-headline">Headline</Label>
              <Input
                id="features-headline"
                value={section.content.headline}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, headline: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Features</Label>
              {section.content.features.map((feature: any, index: number) => (
                <div key={index} className="mt-4 p-4 border rounded-md">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium">Feature {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newFeatures = [...section.content.features]
                        newFeatures.splice(index, 1)
                        handleUpdateSectionContent(section.id, { ...section.content, features: newFeatures })
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <Label htmlFor={`feature-title-${index}`}>Title</Label>
                      <Input
                        id={`feature-title-${index}`}
                        value={feature.title}
                        onChange={(e) => {
                          const newFeatures = [...section.content.features]
                          newFeatures[index].title = e.target.value
                          handleUpdateSectionContent(section.id, { ...section.content, features: newFeatures })
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`feature-desc-${index}`}>Description</Label>
                      <Textarea
                        id={`feature-desc-${index}`}
                        value={feature.description}
                        onChange={(e) => {
                          const newFeatures = [...section.content.features]
                          newFeatures[index].description = e.target.value
                          handleUpdateSectionContent(section.id, { ...section.content, features: newFeatures })
                        }}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`feature-icon-${index}`}>Icon</Label>
                      <Input
                        id={`feature-icon-${index}`}
                        value={feature.icon}
                        onChange={(e) => {
                          const newFeatures = [...section.content.features]
                          newFeatures[index].icon = e.target.value
                          handleUpdateSectionContent(section.id, { ...section.content, features: newFeatures })
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => {
                  const newFeatures = [
                    ...section.content.features,
                    { title: "New Feature", description: "Description", icon: "✨" },
                  ]
                  handleUpdateSectionContent(section.id, { ...section.content, features: newFeatures })
                }}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Feature
              </Button>
            </div>
          </div>
        )
      case "cta":
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="cta-headline">Headline</Label>
              <Input
                id="cta-headline"
                value={section.content.headline}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, headline: e.target.value })
                }
              />
            </div>
            <div>
              <Label htmlFor="cta-description">Description</Label>
              <Textarea
                id="cta-description"
                value={section.content.description}
                onChange={(e) =>
                  handleUpdateSectionContent(section.id, { ...section.content, description: e.target.value })
                }
              />
            </div>
            <div>
              <Label>Button</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  placeholder="Label"
                  value={section.content.button.label}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      button: { ...section.content.button, label: e.target.value },
                    })
                  }
                />
                <Input
                  placeholder="URL"
                  value={section.content.button.url}
                  onChange={(e) =>
                    handleUpdateSectionContent(section.id, {
                      ...section.content,
                      button: { ...section.content.button, url: e.target.value },
                    })
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="cta-background">Background Style</Label>
              <Select
                value={section.content.background}
                onValueChange={(value) =>
                  handleUpdateSectionContent(section.id, { ...section.content, background: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select background style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gradient">Gradient</SelectItem>
                  <SelectItem value="solid">Solid Color</SelectItem>
                  <SelectItem value="image">Background Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )
      default:
        return (
          <div className="p-4 text-center text-muted-foreground">Editor for {section.type} not implemented yet</div>
        )
    }
  }

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Pages
          </Button>
          <h2 className="text-xl font-bold">{pageSettings.title}</h2>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 flex-1 overflow-hidden">
        {/* Components Panel */}
        <Card className="col-span-1 overflow-auto">
          <CardContent className="p-4">
            <Tabs defaultValue="components">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="components">Components</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              <TabsContent value="components" className="mt-4">
                <div className="grid grid-cols-2 gap-2">
                  {componentTypes.map((component) => (
                    <Button
                      key={component.id}
                      variant="outline"
                      className="h-auto py-2 justify-start"
                      onClick={() => handleAddSection(component.id)}
                    >
                      <div className="flex flex-col items-center text-center w-full">
                        <span className="text-2xl mb-1">{component.icon}</span>
                        <span className="text-xs">{component.name}</span>
                      </div>
                    </Button>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="settings" className="mt-4 space-y-4">
                <div>
                  <Label htmlFor="page-title">Page Title</Label>
                  <Input
                    id="page-title"
                    value={pageSettings.title}
                    onChange={(e) => setPageSettings({ ...pageSettings, title: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="page-description">Meta Description</Label>
                  <Textarea
                    id="page-description"
                    value={pageSettings.description}
                    onChange={(e) => setPageSettings({ ...pageSettings, description: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="page-keywords">Meta Keywords</Label>
                  <Input
                    id="page-keywords"
                    value={pageSettings.keywords}
                    onChange={(e) => setPageSettings({ ...pageSettings, keywords: e.target.value })}
                  />
                </div>
                <div>
                  <Label htmlFor="og-image">OG Image URL</Label>
                  <Input
                    id="og-image"
                    value={pageSettings.ogImage}
                    onChange={(e) => setPageSettings({ ...pageSettings, ogImage: e.target.value })}
                  />
                </div>
                <Accordion type="single" collapsible>
                  <AccordionItem value="analytics">
                    <AccordionTrigger>Analytics</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <Label htmlFor="ga-id">Google Analytics ID</Label>
                        <Input
                          id="ga-id"
                          value={pageSettings.googleAnalyticsId}
                          onChange={(e) => setPageSettings({ ...pageSettings, googleAnalyticsId: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="fb-pixel">Facebook Pixel ID</Label>
                        <Input
                          id="fb-pixel"
                          value={pageSettings.facebookPixelId}
                          onChange={(e) => setPageSettings({ ...pageSettings, facebookPixelId: e.target.value })}
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="advanced">
                    <AccordionTrigger>Advanced</AccordionTrigger>
                    <AccordionContent className="space-y-4">
                      <div>
                        <Label htmlFor="custom-css">Custom CSS</Label>
                        <Textarea
                          id="custom-css"
                          value={pageSettings.customCSS}
                          onChange={(e) => setPageSettings({ ...pageSettings, customCSS: e.target.value })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="custom-js">Custom JavaScript</Label>
                        <Textarea
                          id="custom-js"
                          value={pageSettings.customJS}
                          onChange={(e) => setPageSettings({ ...pageSettings, customJS: e.target.value })}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="cookie-banner"
                          checked={pageSettings.showCookieBanner}
                          onCheckedChange={(checked) => setPageSettings({ ...pageSettings, showCookieBanner: checked })}
                        />
                        <Label htmlFor="cookie-banner">Show Cookie Banner</Label>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Preview Panel */}
        <Card className="col-span-2 overflow-auto">
          <CardContent className="p-0">
            <div className="bg-gray-100 p-4 border-b">
              <div className="bg-white border rounded-md shadow-sm">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="sections">
                    {(provided) => (
                      <div {...provided.droppableProps} ref={provided.innerRef} className="min-h-[500px]">
                        {sections.length === 0 ? (
                          <div className="flex items-center justify-center h-[500px] text-muted-foreground">
                            Add components from the left panel
                          </div>
                        ) : (
                          sections.map((section, index) => (
                            <Draggable key={section.id} draggableId={section.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className={`mb-4 border rounded-md overflow-hidden ${activeSectionId === section.id ? "ring-2 ring-blue-500" : ""}`}
                                >
                                  <div className="bg-gray-50 p-2 border-b flex justify-between items-center">
                                    <div className="flex items-center">
                                      <div {...provided.dragHandleProps} className="mr-2 cursor-move">
                                        <MoveVertical className="h-4 w-4" />
                                      </div>
                                      <span className="text-sm font-medium capitalize">{section.type}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => setActiveSectionId(section.id)}
                                      >
                                        <Settings className="h-4 w-4" />
                                      </Button>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeleteSection(section.id)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                  <div className="bg-white">{renderSectionPreview(section)}</div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Properties Panel */}
        <Card className="col-span-1 overflow-auto">
          <CardContent className="p-4">
            {activeSectionId ? (
              <div>
                <h3 className="text-lg font-medium mb-4 capitalize">
                  {sections.find((s) => s.id === activeSectionId)?.type} Properties
                </h3>
                {renderSectionEditor(sections.find((s) => s.id === activeSectionId))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center text-muted-foreground p-4">
                <Settings className="h-8 w-8 mb-2 opacity-50" />
                <p>Select a section to edit its properties</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
