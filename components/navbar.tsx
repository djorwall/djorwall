"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { SmartphoneIcon as MobileIcon } from "lucide-react"
import { useEffect, useState } from "react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { signOut } from "@/app/actions/auth"

export function Navbar() {
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = getSupabaseBrowserClient()
      const { data } = await supabase.auth.getSession()
      setIsLoggedIn(!!data.session)
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <MobileIcon className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold text-primary">
            Appopener.io
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          {!isLoading && (
            <>
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
                  <form action={signOut}>
                    <Button variant="outline" type="submit">
                      Logout
                    </Button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className={`text-sm font-medium ${
                      pathname === "/login" ? "text-primary" : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    Login
                  </Link>
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                </>
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
