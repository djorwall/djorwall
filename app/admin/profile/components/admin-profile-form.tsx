"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { createClientClient } from "@/utils/supabase/client"

interface AdminProfileFormProps {
  user: {
    id: string
    email: string
    full_name: string
  }
}

export function AdminProfileForm({ user }: AdminProfileFormProps) {
  const router = useRouter()
  const supabase = createClientClient()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: user.full_name || "",
    email: user.email || "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Update user in the database
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          email: formData.email,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user.id)

      if (updateError) throw updateError

      // Update auth email if changed
      if (formData.email !== user.email) {
        const { error: authError } = await supabase.auth.updateUser({
          email: formData.email,
        })

        if (authError) throw authError
      }

      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating profile:", error)
      toast.error("Failed to update profile", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="full_name">Full Name</Label>
        <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} required />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email Address</Label>
        <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        {formData.email !== user.email && (
          <p className="text-xs text-amber-600">If you change your email, you will need to verify the new address.</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  )
}
