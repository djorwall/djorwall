"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SmartphoneIcon } from "lucide-react"
import { useState, useEffect } from "react"
import { createClientComponent } from "@/lib/supabase/auth"
import { signOut } from "@/app/actions/auth"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { User } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [username, setUsername] = useState("")

  // Check if user is logged in
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const supabase = createClientComponent()
        const { data } = await supabase.auth.getSession()
        setIsLoggedIn(!!data.session)

        if (data.session?.user) {
          const { data: userData } = await supabase
            .from("profiles")
            .select("full_name")
            .eq("id", data.session.user.id)
            .single()

          if (userData?.full_name) {
            setUsername(userData.full_name)
          }
        }
      } catch (error) {
        console.error("Error checking auth:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <SmartphoneIcon className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold text-primary">
            Appopener.io
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {!isLoading && (
            <>
              <Link
                href="/"
                className={`text-sm font-medium ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Home
              </Link>
              {isLoggedIn ? (
                <>
                  <Link
                    href="/dashboard"
                    className={`text-sm font-medium ${
                      pathname === "/dashboard" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Dashboard
                  </Link>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" className="gap-2">
                        <User size={16} />
                        <span className="max-w-[100px] truncate">{username || "Account"}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href="/dashboard">My Dashboard</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={async () => {
                          await signOut()
                        }}
                        className="text-red-600 cursor-pointer"
                      >
                        Sign Out
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </>
              ) : (
                <Button asChild>
                  <Link href="/login">Sign In</Link>
                </Button>
              )}
            </>
          )}
        </nav>
        <div className="md:hidden">
          <Button variant="ghost" size="icon">
            <span className="sr-only">Toggle menu</span>
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
              className="h-6 w-6"
            >
              <line x1="4" x2="20" y1="12" y2="12" />
              <line x1="4" x2="20" y1="6" y2="6" />
              <line x1="4" x2="20" y1="18" y2="18" />
            </svg>
          </Button>
        </div>
      </div>
    </header>
  )
}
