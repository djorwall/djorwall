"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { User } from "@supabase/supabase-js"
import { toast } from "sonner"

import { getCurrentUser, getUserProfile, logout, type UserProfile } from "@/lib/auth-service"

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  isLoading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { user, error } = await getCurrentUser()

        if (error || !user) {
          setUser(null)
          setProfile(null)
          setIsLoading(false)
          return
        }

        setUser(user)

        // Get user profile
        const { profile, error: profileError } = await getUserProfile(user.id)

        if (profileError) {
          console.error("Error fetching profile:", profileError)
        } else {
          setProfile(profile)
        }
      } catch (error) {
        console.error("Auth check error:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkUser()
  }, [])

  const signOut = async () => {
    try {
      const { error } = await logout()

      if (error) {
        toast.error("Error signing out", {
          description: error.message,
        })
        return
      }

      setUser(null)
      setProfile(null)
      router.push("/")
      toast.success("Signed out successfully")
    } catch (error) {
      console.error("Sign out error:", error)
      toast.error("An unexpected error occurred")
    }
  }

  const refreshProfile = async () => {
    if (!user) return

    try {
      const { profile, error } = await getUserProfile(user.id)

      if (error) {
        console.error("Error refreshing profile:", error)
        return
      }

      setProfile(profile)
    } catch (error) {
      console.error("Profile refresh error:", error)
    }
  }

  return (
    <AuthContext.Provider value={{ user, profile, isLoading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
