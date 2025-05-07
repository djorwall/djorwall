"use client"

import Link from "next/link"
import { BarChart3, FileText, Home, LogOut, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"

interface AgentSidebarProps {
  onSignOut: () => void
}

export function AgentSidebar({ onSignOut }: AgentSidebarProps) {
  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Agent Dashboard</h2>
        <div className="space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/agent">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/agent/sheets">
              <FileText className="mr-2 h-4 w-4" />
              Sheets
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/agent/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/agent/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/agent/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button variant="outline" className="w-full" onClick={onSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )
}
