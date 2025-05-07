"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AgentSidebar } from "./agent-sidebar"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function AgentDashboardHeader() {
  const pathname = usePathname()
  const { user, profile, signOut } = useAuth()

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <AgentSidebar onSignOut={signOut} />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">InfluencerSheets</span>
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link
            href="/dashboard/agent"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/agent" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Dashboard
          </Link>
          <Link
            href="/dashboard/agent/sheets"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/agent/sheets" || pathname.startsWith("/dashboard/agent/sheets/")
                ? "text-primary"
                : "text-muted-foreground"
            }`}
          >
            Sheets
          </Link>
          <Link
            href="/dashboard/agent/analytics"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/agent/analytics" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Analytics
          </Link>
          <Link
            href="/dashboard/agent/profile"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/agent/profile" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Profile
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
            <span className="sr-only">Notifications</span>
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 overflow-hidden">
                <Avatar>
                  <AvatarImage
                    src={
                      profile?.companyName
                        ? `/placeholder.svg?height=32&width=32&query=${profile.companyName}`
                        : undefined
                    }
                    alt={profile?.fullName || "User"}
                  />
                  <AvatarFallback>{profile?.fullName ? getInitials(profile.fullName) : "U"}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>{profile?.fullName || "My Account"}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard/agent/profile" className="cursor-pointer">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/agent/settings" className="cursor-pointer">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
