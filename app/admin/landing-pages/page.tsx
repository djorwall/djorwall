import type { Metadata } from "next"
import LandingPageManagement from "@/components/admin/landing-page-management"

export const metadata: Metadata = {
  title: "Landing Page Management | Admin Dashboard",
  description: "Manage landing pages for your application",
}

export default function LandingPagesPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Landing Page Management</h1>
        <p className="text-muted-foreground">Create and manage landing pages for your marketing campaigns</p>
      </div>
      <LandingPageManagement />
    </div>
  )
}
