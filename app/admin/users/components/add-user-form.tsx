"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { addUserByAdmin } from "../../actions/user-actions"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle2 } from "lucide-react"

export function AddUserForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess] = useState(false)
  const [addedUser, setAddedUser] = useState<any>(null)

  // Form state
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    role: "agent",
    companyName: "",
    brandName: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleRoleChange = (value: string) => {
    setFormData({
      ...formData,
      role: value as "admin" | "agent" | "brand",
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setSuccess(false)

    try {
      const result = await addUserByAdmin({
        email: formData.email,
        password: formData.password,
        fullName: formData.fullName,
        role: formData.role as "admin" | "agent" | "brand",
        companyName: formData.role === "agent" ? formData.companyName : undefined,
        brandName: formData.role === "brand" ? formData.brandName : undefined,
      })

      if (!result.success) {
        toast.error("Failed to add user", {
          description: result.error,
        })
        return
      }

      // Show success message
      setSuccess(true)
      setAddedUser(result.user)
      toast.success("User added successfully", {
        description: `${formData.fullName} has been added as a ${formData.role}`,
      })

      // Reset form
      setFormData({
        email: "",
        password: "",
        fullName: "",
        role: "agent",
        companyName: "",
        brandName: "",
      })
    } catch (error: any) {
      toast.error("An unexpected error occurred", {
        description: error.message || "Please try again later",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {success && addedUser && (
        <Alert className="mb-6 bg-green-50">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertTitle>User added successfully</AlertTitle>
          <AlertDescription>
            <p>
              <strong>{addedUser.fullName}</strong> has been added as a {addedUser.role} with email{" "}
              <strong>{addedUser.email}</strong>
            </p>
            <p className="text-sm mt-2">
              The user can now log in with the provided credentials. No email verification is required.
            </p>
          </AlertDescription>
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="fullName">Full Name</Label>
          <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleChange}
              required
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
              <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Role</Label>
          <Select value={formData.role} onValueChange={handleRoleChange}>
            <SelectTrigger id="role">
              <SelectValue placeholder="Select role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="agent">Agent</SelectItem>
              <SelectItem value="brand">Brand</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {formData.role === "agent" && (
          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name</Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Agency or company name"
            />
          </div>
        )}

        {formData.role === "brand" && (
          <div className="space-y-2">
            <Label htmlFor="brandName">Brand Name</Label>
            <Input
              id="brandName"
              name="brandName"
              value={formData.brandName}
              onChange={handleChange}
              placeholder="Brand name"
            />
          </div>
        )}

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.push("/admin/users")}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Adding User..." : "Add User"}
          </Button>
        </div>
      </form>
    </div>
  )
}
