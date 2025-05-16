"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart2, Link2, List, Settings, User, Home, LogOut } from "lucide-react"

const navItems = [
  {
    title: "Create Link",
    href: "/dashboard",
    icon: Link2,
  },
  {
    title: "My Links",
    href: "/dashboard/links",
    icon: List,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    title: "Profile",
    href: "/dashboard/profile",
    icon: User,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardSidebar() {
  const pathname = usePathname()

  return (
    <div className="w-64 border-r h-screen bg-white flex flex-col">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center gap-2">
          <Home className="h-5 w-5 text-primary" />
          <span className="font-bold text-lg">Appopener.io</span>
        </Link>
      </div>

      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href

            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm ${
                    isActive ? "bg-primary text-white" : "text-muted-foreground hover:bg-secondary"
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <div className="p-4 border-t">
        <Link
          href="/logout"
          className="flex items-center gap-3 px-3 py-2 rounded-md text-sm text-muted-foreground hover:bg-secondary"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Link>
      </div>
    </div>
  )
}
