"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Smartphone } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Header() {
  const { user, signOut, isAdmin } = useAuth()

  return (
    <header className="border-b bg-white">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-blue-600 font-semibold">
          <Smartphone className="h-5 w-5" />
          <span className="text-xl">Appopener.io</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-blue-600">
            About
          </Link>
          {user ? (
            <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Dashboard
            </Link>
          ) : (
            <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Pricing
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="text-sm font-medium text-gray-600 hover:text-blue-600">
              Admin
            </Link>
          )}
        </nav>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={signOut} size="sm">
                Logout
              </Button>
              <Button asChild size="sm">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-blue-600">
                Login
              </Link>
              <Button asChild size="sm">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
