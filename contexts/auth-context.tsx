"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import type { Session, User, Provider } from "@supabase/supabase-js"
import { createBrowserSupabaseClient } from "@/lib/supabase"

type UserProfile = {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: "user" | "admin" | "superadmin"
  subscription_tier: "free" | "pro" | "business" | "enterprise"
  subscription_start_date: string | null
  subscription_end_date: string | null
  is_email_verified: boolean
}

type AuthContextType = {
  user: User | null
  profile: UserProfile | null
  session: Session | null
  isLoading: boolean
  signIn: (
    email: string,
    password: string,
  ) => Promise<{
    error: Error | null
    data: Session | null
  }>
  signUp: (
    email: string,
    password: string,
    fullName: string,
  ) => Promise<{
    error: Error | null
    data: { user: User | null; session: Session | null }
  }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{
    error: Error | null
    data: {} | null
  }>
  updateProfile: (profile: Partial<UserProfile>) => Promise<{
    error: Error | null
    data: UserProfile | null
  }>
  signInWithProvider: (provider: Provider) => Promise<void>
  isAdmin: boolean
  isEmailVerified: boolean
  hasActiveSubscription: boolean
  subscriptionTier: string | null
  subscriptionEndsAt: Date | null
  refreshSession: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [supabase] = useState(() => createBrowserSupabaseClient())
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getSession = async () => {
      setIsLoading(true)
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      }

      setIsLoading(false)
    }

    getSession()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session)
      setUser(session?.user ?? null)

      if (session?.user) {
        await fetchUserProfile(session.user.id)
      } else {
        setProfile(null)
      }

      setIsLoading(false)
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const fetchUserProfile = async (userId: string) => {
    const { data, error } = await supabase.from("user_profiles").select("*").eq("id", userId).single()

    if (error) {
      console.error("Error fetching user profile:", error)
      return null
    }

    setProfile(data as UserProfile)
    return data
  }

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    const response = await supabase.auth.signInWithPassword({ email, password })
    setIsLoading(false)
    return response
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    setIsLoading(true)
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${window.location.origin}/verify-email`,
      },
    })
    setIsLoading(false)
    return response
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  const resetPassword = async (email: string) => {
    return await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
  }

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    if (!user) {
      return { error: new Error("User not authenticated"), data: null }
    }

    const { data, error } = await supabase.from("user_profiles").update(profileData).eq("id", user.id).select().single()

    if (!error && data) {
      setProfile(data as UserProfile)
    }

    return { data: data as UserProfile | null, error }
  }

  const signInWithProvider = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const refreshSession = async () => {
    const { data, error } = await supabase.auth.refreshSession()
    if (!error && data.session) {
      setSession(data.session)
      setUser(data.session.user)
      if (data.session.user) {
        await fetchUserProfile(data.session.user.id)
      }
    }
  }

  // Derived state
  const isAdmin = profile?.role === "admin" || profile?.role === "superadmin"
  const isEmailVerified = profile?.is_email_verified || false

  // Subscription status
  const hasActiveSubscription =
    profile?.subscription_tier !== "free" &&
    profile?.subscription_end_date !== null &&
    new Date(profile?.subscription_end_date || "") > new Date()

  const subscriptionTier = profile?.subscription_tier || null
  const subscriptionEndsAt = profile?.subscription_end_date ? new Date(profile.subscription_end_date) : null

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        session,
        isLoading,
        signIn,
        signUp,
        signOut,
        resetPassword,
        updateProfile,
        signInWithProvider,
        isAdmin,
        isEmailVerified,
        hasActiveSubscription,
        subscriptionTier,
        subscriptionEndsAt,
        refreshSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
