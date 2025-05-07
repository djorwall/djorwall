"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">InfluencerSheets</span>
        </Link>
        <nav className="hidden md:flex md:gap-6 lg:gap-10">
          <Link href="#features" className="text-sm font-medium transition-colors hover:text-primary">
            Features
          </Link>
          <Link href="#for-agents" className="text-sm font-medium transition-colors hover:text-primary">
            For Agents
          </Link>
          <Link href="#for-brands" className="text-sm font-medium transition-colors hover:text-primary">
            For Brands
          </Link>
          <Link href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
            How It Works
          </Link>
          <Link href="#contact" className="text-sm font-medium transition-colors hover:text-primary">
            Contact
          </Link>
        </nav>
        <div className="hidden md:flex md:items-center md:gap-4">
          <Button asChild variant="ghost">
            <Link href="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Sign Up</Link>
          </Button>
        </div>
        <button className="block md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Toggle menu">
          {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile menu */}
      <div
        className={cn(
          "absolute inset-x-0 top-16 z-50 w-full origin-top border-b bg-background px-4 pb-6 pt-2 shadow-lg md:hidden",
          {
            hidden: !isMenuOpen,
          },
        )}
      >
        <nav className="grid gap-4 py-4">
          <Link
            href="#features"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Features
          </Link>
          <Link
            href="#for-agents"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            For Agents
          </Link>
          <Link
            href="#for-brands"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            For Brands
          </Link>
          <Link
            href="#how-it-works"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            How It Works
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium transition-colors hover:text-primary"
            onClick={() => setIsMenuOpen(false)}
          >
            Contact
          </Link>
        </nav>
        <div className="grid gap-2 pt-2">
          <Button asChild variant="outline" className="w-full">
            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
              Login
            </Link>
          </Button>
          <Button asChild className="w-full">
            <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  )
}
