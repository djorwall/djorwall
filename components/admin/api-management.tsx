"use client"

import { useState } from "react"
import { Plus, Copy, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"

// Mock data for API keys
const mockApiKeys = [
  {
    id: "1",
    name: "Production API Key",
    key: "app_1234567890abcdefghijklmn",
    created: "2023-05-15",
    lastUsed: "2023-08-22",
    permissions: ["read", "write"],
    status: "active",
  },
  {
    id: "2",
    name: "Development API Key",
    key: "app_dev_0987654321zyxwvutsrqpo",
    created: "2023-06-10",
    lastUsed: "2023-08-21",
    permissions: ["read"],
    status: "active",
  },
  {
    id: "3",
    name: "Testing API Key",
    key: "app_test_abcdefghijklmnopqrstuv",
    created: "2023-07-05",
    lastUsed: "2023-07-30",
    permissions: ["read", "write"],
    status: "inactive",
  },
]

// Mock data for webhooks
const mockWebhooks = [
  {
    id: "1",
    name: "New Link Notification",
    url: "https://example.com/webhooks/new-link",
    events: ["link.created"],
    created: "2023-06-20",
    lastTriggered: "2023-08-21",
    status: "active",
  },
  {
    id: "2",
    name: "Link Click Tracker",
    url: "https://example.com/webhooks/link-click",
    events: ["link.clicked"],
    created: "2023-07-12",
    lastTriggered: "2023-08-22",
    status: "active",
  },
  {
    id: "3",
    name: "User Registration",
    url: "https://example.com/webhooks/user-register",
    events: ["user.created"],
    created: "2023-05-30",
    lastTriggered: "2023-08-15",
    status: "inactive",
  },
]

// Mock data for integrations
const mockIntegrations = [
  {
    id: "1",
    name: "Google Analytics",
    status: "connected",
    connectedAt: "2023-06-15",
    accountName: "Company Analytics",
    icon: "🔍",
  },
  {
    id: "2",
    name: "Facebook Pixel",
    status: "connected",
    connectedAt: "2023-07-10",
    accountName: "Marketing Account",
    icon: "📊",
  },
  {
    id: "3",
    name: "Mailchimp",
    status: "disconnected",
    connectedAt: null,
    accountName: null,
    icon: "📧",
  },
  {
    id: "4",
    name: "Slack",
    status: "connected",
    connectedAt: "2023-08-05",
    accountName: "Company Workspace",
    icon: "💬",
  },
  {
    id: "5",
    name: "Zapier",
    status: "disconnected",
    connectedAt: null,
    accountName: null,
    icon: "⚡",
  },
]

export default function ApiManagement() {
  const [apiKeys, setApiKeys] = useState(mockApiKeys)
  const [webhooks, setWebhooks] = useState(mockWebhooks)
  const [integrations, setIntegrations] = useState(mockIntegrations)
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({})
  const [isCreateKeyDialogOpen, setIsCreateKeyDialogOpen] = useState(false)
  const [isCreateWebhookDialogOpen, setIsCreateWebhookDialogOpen] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    name: "",
    permissions: ["read"],
  })
  const [newWebhook, setNewWebhook] = useState({
    name: "",
    url: "",
    events: [] as string[],
  })

  const toggleKeyVisibility = (id: string) => {
    setShowKeys({
      ...showKeys,
      [id]: !showKeys[id],
    })
  }

  const handleCreateApiKey = () => {
    const id = Math.random().toString(36).substring(2, 9)
    const key = `app_${Math.random().toString(36).substring(2, 30)}`

    const newKey = {
      id,
      name: newApiKey.name,
      key,
      created: new Date().toISOString().split("T")[0],
      lastUsed: "-",
      permissions: newApiKey.permissions,
      status: "active",
    }

    setApiKeys([...apiKeys, newKey])
    setNewApiKey({
      name: "",
      permissions: ["read"],
    })
    setIsCreateKeyDialogOpen(false)

    // Automatically show the newly created key
    setShowKeys({
      ...showKeys,
      [id]: true,
    })
  }

  const handleCreateWebhook = () => {
    const id = Math.random().toString(36).substring(2, 9)

    const newHook = {
      id,
      name: newWebhook.name,
      url: newWebhook.url,
      events: newWebhook.events,
      created: new Date().toISOString().split("T")[0],
      lastTriggered: "-",
      status: "active",
    }

    setWebhooks([...webhooks, newHook])
    setNewWebhook({
      name: "",
      url: "",
      events: [],
    })
    setIsCreateWebhookDialogOpen(false)
  }

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((key) => key.id !== id))
  }

  const handleDeleteWebhook = (id: string) => {
    setWebhooks(webhooks.filter((webhook) => webhook.id !== id))
  }

  const handleToggleApiKeyStatus = (id: string) => {
    setApiKeys(
      apiKeys.map((key) => (key.id === id ? { ...key, status: key.status === "active" ? "inactive" : "active" } : key)),
    )
  }

  const handleToggleWebhookStatus = (id: string) => {
    setWebhooks(
      webhooks.map((webhook) =>
        webhook.id === id ? { ...webhook, status: webhook.status === "active" ? "inactive" : "active" } : webhook,
      ),
    )
  }

  const handleConnectIntegration = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: "connected",
              connectedAt: new Date().toISOString().split("T")[0],
              accountName: "Connected Account",
            }
          : integration,
      ),
    )
  }

  const handleDisconnectIntegration = (id: string) => {
    setIntegrations(
      integrations.map((integration) =>
        integration.id === id
          ? {
              ...integration,
              status: "disconnected",
              connectedAt: null,
              accountName: null,
            }
          : integration,
      ),
    )
  }

  return (
    <Tabs defaultValue="api-keys" className="space-y-6">
      <TabsList>
        <TabsTrigger value="api-keys">API Keys</TabsTrigger>
        <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        <TabsTrigger value="integrations">Integrations</TabsTrigger>
        <TabsTrigger value="payment-gateways">Payment Gateways</TabsTrigger>
      </TabsList>

      {/* API Keys Tab */}
      <TabsContent value="api-keys">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">API Keys</h2>
          <Dialog open={isCreateKeyDialogOpen} onOpenChange={setIsCreateKeyDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create API Key
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New API Key</DialogTitle>
                <DialogDescription>Create a new API key to authenticate your applications.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Key Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. Production API Key"
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Permissions</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={newApiKey.permissions.includes("read") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newApiKey.permissions.includes("read")) {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: newApiKey.permissions.filter((p) => p !== "read"),
                          })
                        } else {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: [...newApiKey.permissions, "read"],
                          })
                        }
                      }}
                    >
                      Read
                    </Badge>
                    <Badge
                      variant={newApiKey.permissions.includes("write") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newApiKey.permissions.includes("write")) {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: newApiKey.permissions.filter((p) => p !== "write"),
                          })
                        } else {
                          setNewApiKey({
                            ...newApiKey,
                            permissions: [...newApiKey.permissions, "write"],
                          })
                        }
                      }}
                    >
                      Write
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateApiKey}>Create Key</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Key
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Last Used
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Permissions
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {apiKeys.map((apiKey) => (
                <tr key={apiKey.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{apiKey.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {showKeys[apiKey.id] ? apiKey.key : "••••••••••••••••••••••••••••••"}
                      <Button variant="ghost" size="sm" onClick={() => toggleKeyVisibility(apiKey.id)}>
                        {showKeys[apiKey.id] ? "Hide" : "Show"}
                      </Button>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{apiKey.created}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{apiKey.lastUsed}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{apiKey.permissions.join(", ")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={apiKey.status === "active" ? "default" : "destructive"}>{apiKey.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" onClick={() => handleToggleApiKeyStatus(apiKey.id)}>
                      {apiKey.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteApiKey(apiKey.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Webhooks Tab */}
      <TabsContent value="webhooks">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Webhooks</h2>
          <Dialog open={isCreateWebhookDialogOpen} onOpenChange={setIsCreateWebhookDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Webhook
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Webhook</DialogTitle>
                <DialogDescription>Create a new webhook to receive real-time updates.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="name">Webhook Name</Label>
                  <Input
                    id="name"
                    placeholder="e.g. New Link Notification"
                    value={newWebhook.name}
                    onChange={(e) => setNewWebhook({ ...newWebhook, name: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="url">URL</Label>
                  <Input
                    id="url"
                    placeholder="https://example.com/webhooks/new-link"
                    value={newWebhook.url}
                    onChange={(e) => setNewWebhook({ ...newWebhook, url: e.target.value })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label>Events</Label>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      variant={newWebhook.events.includes("link.created") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newWebhook.events.includes("link.created")) {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter((e) => e !== "link.created"),
                          })
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, "link.created"],
                          })
                        }
                      }}
                    >
                      link.created
                    </Badge>
                    <Badge
                      variant={newWebhook.events.includes("link.clicked") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newWebhook.events.includes("link.clicked")) {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter((e) => e !== "link.clicked"),
                          })
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, "link.clicked"],
                          })
                        }
                      }}
                    >
                      link.clicked
                    </Badge>
                    <Badge
                      variant={newWebhook.events.includes("user.created") ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => {
                        if (newWebhook.events.includes("user.created")) {
                          setNewWebhook({
                            ...newWebhook,
                            events: newWebhook.events.filter((e) => e !== "user.created"),
                          })
                        } else {
                          setNewWebhook({
                            ...newWebhook,
                            events: [...newWebhook.events, "user.created"],
                          })
                        }
                      }}
                    >
                      user.created
                    </Badge>
                  </div>
                </div>
              </div>
              <Button onClick={handleCreateWebhook}>Create Webhook</Button>
            </DialogContent>
          </Dialog>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  URL
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Events
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Last Triggered
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 bg-gray-50"></th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {webhooks.map((webhook) => (
                <tr key={webhook.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{webhook.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{webhook.url}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{webhook.events.join(", ")}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{webhook.created}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{webhook.lastTriggered}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <Badge variant={webhook.status === "active" ? "default" : "destructive"}>{webhook.status}</Badge>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Button variant="outline" size="sm" onClick={() => handleToggleWebhookStatus(webhook.id)}>
                      {webhook.status === "active" ? "Deactivate" : "Activate"}
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDeleteWebhook(webhook.id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TabsContent>

      {/* Integrations Tab */}
      <TabsContent value="integrations">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Integrations</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration) => (
            <div key={integration.id} className="border rounded-lg overflow-hidden">
              <div className="bg-white p-6 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center mr-4">
                    <span className="text-2xl">{integration.icon}</span>
                  </div>
                  <div>
                    <h3 className="font-medium">{integration.name}</h3>
                    {integration.accountName && (
                      <p className="text-sm text-muted-foreground">{integration.accountName}</p>
                    )}
                  </div>
                </div>
                <Badge variant={integration.status === "connected" ? "default" : "outline"}>{integration.status}</Badge>
              </div>
              <div className="border-t p-6 flex justify-end">
                {integration.status === "connected" ? (
                  <Button variant="outline" onClick={() => handleDisconnectIntegration(integration.id)}>
                    Disconnect
                  </Button>
                ) : (
                  <Button onClick={() => handleConnectIntegration(integration.id)}>Connect</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </TabsContent>

      {/* Payment Gateways Tab */}
      <TabsContent value="payment-gateways">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Payment Gateways</h2>
          <Button variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add Gateway
          </Button>
        </div>

        <div className="grid gap-6">
          {/* Razorpay Integration Card */}
          <div className="border rounded-lg overflow-hidden">
            <div className="bg-white p-6 flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-md bg-blue-50 flex items-center justify-center mr-4">
                  <span className="text-2xl">💸</span>
                </div>
                <div>
                  <h3 className="font-medium">Razorpay</h3>
                  <p className="text-sm text-muted-foreground">Payment gateway for subscription transactions</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Connected
              </Badge>
            </div>

            <div className="border-t p-6">
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="razorpay-key-id">API Key ID</Label>
                    <div className="flex mt-1">
                      <Input
                        id="razorpay-key-id"
                        type="password"
                        value="rzp_test_••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button variant="outline" className="rounded-l-none border-l-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="razorpay-key-secret">API Key Secret</Label>
                    <div className="flex mt-1">
                      <Input
                        id="razorpay-key-secret"
                        type="password"
                        value="••••••••••••••••••••••••••••••"
                        className="rounded-r-none"
                        readOnly
                      />
                      <Button variant="outline" className="rounded-l-none border-l-0">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="razorpay-webhook-secret">Webhook Secret</Label>
                  <div className="flex mt-1">
                    <Input
                      id="razorpay-webhook-secret"
                      type="password"
                      value="whsec_••••••••••••••••••••••••••"
                      className="rounded-r-none"
                      readOnly
                    />
                    <Button variant="outline" className="rounded-l-none border-l-0">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Environment</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                        Test Mode
                      </Badge>
                      <Button variant="ghost" size="sm">
                        Switch to Live
                      </Button>
                    </div>
                  </div>
                  <div>
                    <Label>Webhook Status</Label>
                    <div className="flex items-center mt-1 space-x-2">
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Active
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t p-6">
              <h4 className="font-medium mb-4">Subscription Plans</h4>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Plan Name</th>
                      <th className="text-left py-2 px-4 font-medium">Plan ID</th>
                      <th className="text-left py-2 px-4 font-medium">Amount</th>
                      <th className="text-left py-2 px-4 font-medium">Interval</th>
                      <th className="text-left py-2 px-4 font-medium">Status</th>
                      <th className="text-right py-2 px-4 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2 px-4">Basic</td>
                      <td className="py-2 px-4 font-mono text-xs">plan_JeOiXIu9KoqmJW</td>
                      <td className="py-2 px-4">$9.99</td>
                      <td className="py-2 px-4">Monthly</td>
                      <td className="py-2 px-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 px-4">Pro</td>
                      <td className="py-2 px-4 font-mono text-xs">plan_KpYiZTu2LmqnXZ</td>
                      <td className="py-2 px-4">$19.99</td>
                      <td className="py-2 px-4">Monthly</td>
                      <td className="py-2 px-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-2 px-4">Enterprise</td>
                      <td className="py-2 px-4 font-mono text-xs">plan_LqZjYVv3MnroYA</td>
                      <td className="py-2 px-4">$49.99</td>
                      <td className="py-2 px-4">Monthly</td>
                      <td className="py-2 px-4">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Active
                        </Badge>
                      </td>
                      <td className="py-2 px-4 text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4 flex justify-end">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Plan
                </Button>
              </div>
            </div>

            <div className="border-t p-6 bg-muted/20">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">Webhook Endpoint</h4>
                  <p className="text-sm text-muted-foreground mt-1">
                    Configure this URL in your Razorpay dashboard to receive payment events
                  </p>
                </div>
                <div className="flex items-center space-x-2">
                  <code className="px-2 py-1 bg-muted rounded text-xs font-mono">
                    https://appopener.io/api/webhooks/razorpay
                  </code>
                  <Button variant="ghost" size="icon">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="border-t p-6 flex justify-between">
              <Button variant="outline" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                Disconnect
              </Button>
              <div className="space-x-2">
                <Button variant="outline">Test Connection</Button>
                <Button>Save Changes</Button>
              </div>
            </div>
          </div>

          {/* Add more payment gateway cards here */}
        </div>
      </TabsContent>
    </Tabs>
  )
}
