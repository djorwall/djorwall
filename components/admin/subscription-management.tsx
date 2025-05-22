"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowUpDown, Download, Filter, MoreHorizontal, Plus, Search } from "lucide-react"
import { SubscriptionMetricsCards } from "./subscription-metrics"
import { SubscriptionChart } from "./subscription-chart"

// Mock data for demonstration
const subscriptions = [
  {
    id: "sub_1234567890",
    userId: "user_1",
    userName: "John Doe",
    email: "john@example.com",
    plan: "Pro",
    status: "active",
    amount: "$19.99",
    billingCycle: "monthly",
    startDate: "2023-01-15",
    nextBillingDate: "2023-02-15",
    paymentMethod: "Razorpay",
    paymentId: "pay_123456789",
  },
  {
    id: "sub_2345678901",
    userId: "user_2",
    userName: "Jane Smith",
    email: "jane@example.com",
    plan: "Enterprise",
    status: "active",
    amount: "$99.99",
    billingCycle: "annual",
    startDate: "2023-02-10",
    nextBillingDate: "2024-02-10",
    paymentMethod: "Razorpay",
    paymentId: "pay_234567890",
  },
  {
    id: "sub_3456789012",
    userId: "user_3",
    userName: "Robert Johnson",
    email: "robert@example.com",
    plan: "Basic",
    status: "canceled",
    amount: "$9.99",
    billingCycle: "monthly",
    startDate: "2023-01-05",
    nextBillingDate: "2023-02-05",
    paymentMethod: "Razorpay",
    paymentId: "pay_345678901",
  },
  {
    id: "sub_4567890123",
    userId: "user_4",
    userName: "Emily Davis",
    email: "emily@example.com",
    plan: "Pro",
    status: "past_due",
    amount: "$19.99",
    billingCycle: "monthly",
    startDate: "2023-01-20",
    nextBillingDate: "2023-02-20",
    paymentMethod: "Razorpay",
    paymentId: "pay_456789012",
  },
  {
    id: "sub_5678901234",
    userId: "user_5",
    userName: "Michael Wilson",
    email: "michael@example.com",
    plan: "Enterprise",
    status: "active",
    amount: "$99.99",
    billingCycle: "annual",
    startDate: "2022-12-15",
    nextBillingDate: "2023-12-15",
    paymentMethod: "Razorpay",
    paymentId: "pay_567890123",
  },
]

// Mock data for subscription plans
const subscriptionPlans = [
  {
    id: "plan_basic",
    name: "Basic",
    description: "Essential features for individuals",
    price: "$9.99",
    billingCycle: "monthly",
    features: ["5 short links per day", "Basic analytics", "Standard support"],
    isPopular: false,
  },
  {
    id: "plan_pro",
    name: "Pro",
    description: "Advanced features for professionals",
    price: "$19.99",
    billingCycle: "monthly",
    features: ["Unlimited short links", "Advanced analytics", "Priority support", "Custom domains"],
    isPopular: true,
  },
  {
    id: "plan_enterprise",
    name: "Enterprise",
    description: "Complete solution for businesses",
    price: "$99.99",
    billingCycle: "annual",
    features: ["Unlimited everything", "Team collaboration", "API access", "Dedicated support", "White labeling"],
    isPopular: false,
  },
]

export default function SubscriptionManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [planFilter, setPlanFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("subscriptions")

  // Filter subscriptions based on search term and filters
  const filteredSubscriptions = subscriptions.filter((sub) => {
    const matchesSearch =
      sub.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.id.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === "all" || sub.status === statusFilter
    const matchesPlan = planFilter === "all" || sub.plan === planFilter

    return matchesSearch && matchesStatus && matchesPlan
  })

  return (
    <div className="space-y-6">
      <Tabs defaultValue="subscriptions" className="w-full" onValueChange={setActiveTab}>
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
          <TabsTrigger value="plans">Plans</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="subscriptions" className="space-y-6">
          <SubscriptionMetricsCards />

          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>User Subscriptions</CardTitle>
                  <CardDescription>Manage and monitor all user subscriptions</CardDescription>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button variant="outline" size="sm" className="flex items-center gap-1">
                    <Download className="h-4 w-4" />
                    Export
                  </Button>
                  <Button size="sm" className="flex items-center gap-1">
                    <Plus className="h-4 w-4" />
                    Add Subscription
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex flex-col md:flex-row gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search subscriptions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[160px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Status</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Statuses</SelectItem>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="canceled">Canceled</SelectItem>
                      <SelectItem value="past_due">Past Due</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={planFilter} onValueChange={setPlanFilter}>
                    <SelectTrigger className="w-[160px]">
                      <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4" />
                        <span>Plan</span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Plans</SelectItem>
                      <SelectItem value="Basic">Basic</SelectItem>
                      <SelectItem value="Pro">Pro</SelectItem>
                      <SelectItem value="Enterprise">Enterprise</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[250px]">
                        <div className="flex items-center gap-1 cursor-pointer">
                          User
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1 cursor-pointer">
                          Plan
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>
                        <div className="flex items-center gap-1 cursor-pointer">
                          Next Billing
                          <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSubscriptions.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No subscriptions found
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredSubscriptions.map((subscription) => (
                        <TableRow key={subscription.id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{subscription.userName}</span>
                              <span className="text-sm text-muted-foreground">{subscription.email}</span>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.plan}</TableCell>
                          <TableCell>
                            <StatusBadge status={subscription.status} />
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{subscription.amount}</span>
                              <span className="text-xs text-muted-foreground">{subscription.billingCycle}</span>
                            </div>
                          </TableCell>
                          <TableCell>{subscription.nextBillingDate}</TableCell>
                          <TableCell className="text-right">
                            <SubscriptionActions subscription={subscription} />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="plans" className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  <CardTitle>Subscription Plans</CardTitle>
                  <CardDescription>Manage your subscription plans and pricing</CardDescription>
                </div>

                <Button size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  Create New Plan
                </Button>
              </div>
            </CardHeader>

            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {subscriptionPlans.map((plan) => (
                  <Card key={plan.id} className={plan.isPopular ? "border-primary" : ""}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{plan.name}</CardTitle>
                          <CardDescription>{plan.description}</CardDescription>
                        </div>
                        {plan.isPopular && <Badge variant="default">Popular</Badge>}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-4">
                        <div className="text-3xl font-bold">{plan.price}</div>
                        <div className="text-sm text-muted-foreground">per {plan.billingCycle}</div>
                      </div>
                      <ul className="space-y-2 mb-6">
                        {plan.features.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="24"
                              height="24"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              className="h-4 w-4 text-primary"
                            >
                              <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          Edit
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>Duplicate</DropdownMenuItem>
                            <DropdownMenuItem>Archive</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <SubscriptionMetricsCards />

          <Card>
            <CardHeader>
              <CardTitle>Subscription Growth</CardTitle>
              <CardDescription>Track subscription growth and revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <SubscriptionChart />
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Plan Distribution</CardTitle>
                <CardDescription>Breakdown of subscriptions by plan</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Plan distribution chart would go here */}
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  Plan distribution chart
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Churn Rate</CardTitle>
                <CardDescription>Monthly subscription cancellation rate</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {/* Churn rate chart would go here */}
                <div className="h-full flex items-center justify-center text-muted-foreground">Churn rate chart</div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "active":
      return (
        <Badge variant="default" className="bg-green-500 hover:bg-green-600">
          Active
        </Badge>
      )
    case "canceled":
      return (
        <Badge variant="outline" className="text-muted-foreground">
          Canceled
        </Badge>
      )
    case "past_due":
      return (
        <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">
          Past Due
        </Badge>
      )
    default:
      return <Badge variant="outline">{status}</Badge>
  }
}

function SubscriptionActions({ subscription }: { subscription: any }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem>View Details</DropdownMenuItem>
        <DropdownMenuItem>Edit Subscription</DropdownMenuItem>
        <DropdownMenuItem>
          <Dialog>
            <DialogTrigger className="w-full text-left">Change Plan</DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Change Subscription Plan</DialogTitle>
                <DialogDescription>Change the subscription plan for {subscription.userName}</DialogDescription>
              </DialogHeader>
              <div className="py-4">
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">Current Plan</label>
                  <div className="text-sm">
                    {subscription.plan} - {subscription.amount} / {subscription.billingCycle}
                  </div>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">New Plan</label>
                  <Select defaultValue="pro">
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="basic">Basic - $9.99 / month</SelectItem>
                      <SelectItem value="pro">Pro - $19.99 / month</SelectItem>
                      <SelectItem value="enterprise">Enterprise - $99.99 / year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mb-4">
                  <label className="text-sm font-medium mb-1 block">When to Apply</label>
                  <Select defaultValue="immediately">
                    <SelectTrigger>
                      <SelectValue placeholder="Select when to apply" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediately">Immediately</SelectItem>
                      <SelectItem value="next_billing">Next Billing Cycle</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline">Cancel</Button>
                <Button>Change Plan</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {subscription.status === "active" ? (
          <DropdownMenuItem className="text-amber-600">Cancel Subscription</DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-green-600">Reactivate Subscription</DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
