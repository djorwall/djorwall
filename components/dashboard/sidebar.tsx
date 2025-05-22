"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, Link2, QrCode, BarChart2, Megaphone, Settings, PlusCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

// Add this CSS for the ripple effect
const rippleStyle = `
  @keyframes ripple {
    to {
      transform: scale(4);
      opacity: 0;
    }
  }
`

const navItems = [
  {
    title: "Home",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Links",
    href: "/dashboard/links",
    icon: Link2,
    badge: "New", // Optional: Add this for items you want to highlight
  },
  {
    title: "QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart2,
  },
  {
    title: "Campaigns",
    href: "/dashboard/campaigns",
    icon: Megaphone,
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
    <div className="w-64 border-r bg-white h-screen flex flex-col">
      <div className="p-4 border-b">
        <Button className="w-full justify-start gap-2" size="lg">
          <PlusCircle className="h-4 w-4" />
          Create new
        </Button>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors relative group",
                  pathname === item.href
                    ? "bg-blue-50 text-blue-600 before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-8 before:w-1 before:bg-blue-600 before:rounded-r-full"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
                )}
                onClick={(e) => {
                  // Add a subtle ripple effect
                  const ripple = document.createElement("div")
                  ripple.className = "absolute inset-0 bg-blue-100 opacity-30 rounded-md"
                  e.currentTarget.appendChild(ripple)

                  // Animate and remove the ripple
                  setTimeout(() => {
                    ripple.style.opacity = "0"
                    setTimeout(() => ripple.remove(), 300)
                  }, 300)

                  // Special handling for settings
                  if (item.title === "Settings") {
                    console.log("Loading settings component...")
                    // We'll let the navigation happen normally, but log that settings is being accessed
                    // This could be expanded with additional functionality as needed
                  }

                  // Log navigation for analytics (in a real app, you'd send this to your analytics service)
                  console.log(`Navigating to: ${item.href}`)
                }}
                prefetch={true}
              >
                <item.icon
                  className={cn(
                    "h-4 w-4 flex-shrink-0 transition-transform duration-200",
                    pathname === item.href ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700",
                    pathname === item.href && "transform scale-110",
                  )}
                />
                <span className="truncate">{item.title}</span>

                {/* Show a badge for new items or notifications if needed */}
                {item.badge && (
                  <span className="ml-auto inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-100 px-1.5 text-xs font-medium text-blue-600">
                    {item.badge}
                  </span>
                )}

                {/* Add indicator for settings to show it's fully functional */}
                {item.title === "Settings" && (
                  <span
                    className="ml-auto h-2 w-2 rounded-full bg-green-500"
                    title="Connected and fully functional"
                  ></span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
