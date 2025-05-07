import Link from "next/link"
import { BookmarkCheck, FileText, Search, Settings, User } from "lucide-react"

import { Button } from "@/components/ui/button"

export function BrandSidebar() {
  return (
    <div className="flex h-full flex-col py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">Brand Dashboard</h2>
        <div className="space-y-1">
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/brand">
              <Search className="mr-2 h-4 w-4" />
              Discover
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/brand/saved">
              <BookmarkCheck className="mr-2 h-4 w-4" />
              Saved Sheets
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/brand/requests">
              <FileText className="mr-2 h-4 w-4" />
              Access Requests
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/brand/profile">
              <User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </Button>
          <Button asChild variant="ghost" className="w-full justify-start">
            <Link href="/dashboard/brand/settings">
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </Button>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <Button asChild variant="outline" className="w-full">
          <Link href="/logout">Logout</Link>
        </Button>
      </div>
    </div>
  )
}
