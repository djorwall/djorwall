import { Suspense } from "react"
import type { Metadata } from "next"
import SubscriptionManagement from "@/components/admin/subscription-management"
import { Skeleton } from "@/components/ui/skeleton"

export const metadata: Metadata = {
  title: "Subscription Management | Admin Dashboard",
  description: "Manage user subscriptions and plans",
}

export default function SubscriptionsPage() {
  return (
    <div className="flex flex-col gap-5 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Subscription Management</h1>
        <p className="text-muted-foreground">Manage user subscriptions, plans, and payment details</p>
      </div>

      <Suspense fallback={<SubscriptionSkeleton />}>
        <SubscriptionManagement />
      </Suspense>
    </div>
  )
}

function SubscriptionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-10 w-32" />
      </div>
      <Skeleton className="h-[600px] w-full" />
    </div>
  )
}
