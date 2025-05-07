"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  FileSpreadsheet,
  BarChart,
  Settings,
  LogOut,
  CheckSquare,
  AlertCircle,
  User,
} from "lucide-react"

export default function AdminSidebar() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const navItems = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    {
      href: "/admin/users",
      label: "Users",
      icon: Users,
      submenu: [
        { href: "/admin/users", label: "All Users" },
        { href: "/admin/users/add", label: "Add User" },
      ],
    },
    { href: "/admin/sheets", label: "Sheets", icon: FileSpreadsheet },
    { href: "/admin/analytics", label: "Analytics", icon: BarChart },
    { href: "/admin/verifications", label: "Verifications", icon: CheckSquare },
    { href: "/admin/settings", label: "Settings", icon: Settings },
    { href: "/admin/profile", label: "My Profile", icon: User },
    { href: "/admin/logs", label: "System Logs", icon: AlertCircle },
  ]

  return (
    <div className="h-full flex flex-col bg-gray-50 border-r">
      <div className="p-6">
        <h2 className="text-xl font-bold">Admin Panel</h2>
      </div>
      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isItemActive = isActive(item.href)

          return (
            <div key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm rounded-md ${
                  isItemActive ? "bg-gray-200 text-gray-900 font-medium" : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>

              {item.submenu && isItemActive && (
                <div className="ml-8 mt-1 space-y-1">
                  {item.submenu.map((subItem) => (
                    <Link
                      key={subItem.href}
                      href={subItem.href}
                      className={`block px-4 py-2 text-sm rounded-md ${
                        isActive(subItem.href)
                          ? "bg-gray-200 text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {subItem.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
      <div className="p-4 mt-auto">
        <Link
          href="/api/auth/signout"
          className="flex items-center px-4 py-3 text-sm text-red-600 hover:bg-red-50 rounded-md"
        >
          <LogOut className="h-5 w-5 mr-3" />
          Sign Out
        </Link>
      </div>
    </div>
  )
}
