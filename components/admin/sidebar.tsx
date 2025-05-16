"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BarChart3, Link2, Settings, Users, Home, LayoutDashboard, Megaphone, Key } from "lucide-react"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function AdminSidebar({ className, ...props }: SidebarProps) {
  const pathname = usePathname()

  return (
    <div className={cn("pb-12", className)} {...props}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-xl font-semibold tracking-tight">Admin Dashboard</h2>
          <div className="space-y-1">
            <Link
              href="/admin"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin" && "bg-accent text-accent-foreground",
              )}
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Overview</span>
            </Link>
            <Link
              href="/admin/users"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/users" && "bg-accent text-accent-foreground",
              )}
            >
              <Users className="mr-2 h-4 w-4" />
              <span>Users</span>
            </Link>
            <Link
              href="/admin/links"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/links" && "bg-accent text-accent-foreground",
              )}
            >
              <Link2 className="mr-2 h-4 w-4" />
              <span>Links</span>
            </Link>
            <Link
              href="/admin/analytics"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/analytics" && "bg-accent text-accent-foreground",
              )}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Configuration</h2>
          <div className="space-y-1">
            <Link
              href="/admin/settings"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/settings" && "bg-accent text-accent-foreground",
              )}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </Link>
            <Link
              href="/admin/api"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/api" && "bg-accent text-accent-foreground",
              )}
            >
              <Key className="mr-2 h-4 w-4" />
              <span>API Keys</span>
            </Link>
            <Link
              href="/admin/ads"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
                pathname === "/admin/ads" && "bg-accent text-accent-foreground",
              )}
            >
              <Megaphone className="mr-2 h-4 w-4" />
              <span>Ads</span>
            </Link>
          </div>
        </div>
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">Other</h2>
          <div className="space-y-1">
            <Link
              href="/dashboard"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>User Dashboard</span>
            </Link>
            <Link
              href="/"
              className={cn(
                "flex items-center rounded-md px-2 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Home className="mr-2 h-4 w-4" />
              <span>Home Page</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
