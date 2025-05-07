"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bell, Menu, User } from "lucide-react"

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
import { BrandSidebar } from "./brand-sidebar"

export function BrandDashboardHeader() {
  const pathname = usePathname()

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
              <BrandSidebar />
            </SheetContent>
          </Sheet>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold">InfluencerSheets</span>
          </Link>
        </div>
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link
            href="/dashboard/brand"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/brand" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Discover
          </Link>
          <Link
            href="/dashboard/brand/saved"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/brand/saved" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Saved Sheets
          </Link>
          <Link
            href="/dashboard/brand/requests"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/brand/requests" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            Requests
          </Link>
          <Link
            href="/dashboard/brand/profile"
            className={`text-sm font-medium transition-colors hover:text-primary ${
              pathname === "/dashboard/brand/profile" ? "text-primary" : "text-muted-foreground"
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
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
                <span className="sr-only">User menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/dashboard/brand/profile" className="flex w-full">
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/dashboard/brand/settings" className="flex w-full">
                  Settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Link href="/logout" className="flex w-full">
                  Logout
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
