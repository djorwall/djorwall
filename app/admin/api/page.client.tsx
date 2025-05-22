"use client"
import ApiManagement from "@/components/admin/api-management"

const API_KEYS = [
  {
    id: "key_live_1234567890",
    name: "Production API Key",
    type: "live",
    created: "2023-04-10",
    lastUsed: "2023-05-24",
    status: "active",
  },
  {
    id: "key_test_1234567890",
    name: "Development API Key",
    type: "test",
    created: "2023-04-10",
    lastUsed: "2023-05-23",
    status: "active",
  },
  {
    id: "key_live_0987654321",
    name: "Dashboard Integration",
    type: "live",
    created: "2023-03-15",
    lastUsed: "2023-05-20",
    status: "active",
  },
  {
    id: "key_test_abcdefghij",
    name: "Mobile App Integration",
    type: "test",
    created: "2023-02-22",
    lastUsed: "2023-04-18",
    status: "revoked",
  },
]

const WEBHOOKS = [
  {
    id: "wh_1234567890",
    url: "https://example.com/webhook/events",
    events: ["link.created", "link.clicked", "qr.scanned"],
    created: "2023-04-15",
    status: "active",
  },
  {
    id: "wh_0987654321",
    url: "https://dashboard.example.com/api/webhook",
    events: ["user.created", "link.created"],
    created: "2023-03-20",
    status: "active",
  },
  {
    id: "wh_abcdefghij",
    url: "https://old-service.example.com/webhook",
    events: ["link.clicked"],
    created: "2023-01-05",
    status: "inactive",
  },
]

export default function ApiPageClient() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">API Management</h1>
        <p className="text-muted-foreground">Manage API keys, webhooks, and integrations</p>
      </div>
      <ApiManagement />
    </div>
  )
}
