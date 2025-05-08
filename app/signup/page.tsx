"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { signUp } from "@/lib/auth-service"

export default function SignupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  // Form state
  const [role, setRole] = useState(searchParams.get("role") || "agent")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [brandName, setBrandName] = useState("")

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const fullName = `${firstName} ${lastName}`.trim()

      const { user, error } = await signUp({
        email,
        password,
        fullName,
        role: role as "agent" | "brand",
        companyName: role === "agent" ? companyName : undefined,
        brandName: role === "brand" ? brandName : undefined,
      })

      if (error) {
        toast.error("Signup failed", {
          description: error.message || "Please check your information and try again.",
        })
        setIsLoading(false)
        return
      }

      // Show success message
      toast.success("Account created successfully", {
        description: "Welcome to the platform!",
      })

      // Redirect to the appropriate dashboard based on role
      if (role === "agent") {
        router.push("/dashboard/agent")
      } else {
        router.push("/dashboard/brand")
      }
    } catch (error) {
      toast.error("An unexpected error occurred", {
        description: "Please try again later.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Create an account</CardTitle>
        <CardDescription>Enter your information below to create your account</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Account Type</Label>
            <RadioGroup defaultValue={role} onValueChange={setRole} className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="agent" id="agent" />
                <Label htmlFor="agent" className="cursor-pointer">
                  Agent
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brand" id="brand" />
                <Label htmlFor="brand" className="cursor-pointer">
                  Brand
                </Label>
              </div>
            </RadioGroup>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first-name">First name</Label>
              <Input id="first-name" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last-name">Last name</Label>
              <Input id="last-name" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
          {role === "agent" && (
            <div className="space-y-2">
              <Label htmlFor="company">Agency/Company Name</Label>
              <Input
                id="company"
                placeholder="Your agency name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
              />
            </div>
          )}
          {role === "brand" && (
            <div className="space-y-2">
              <Label htmlFor="brand-name">Brand Name</Label>
              <Input
                id="brand-name"
                placeholder="Your brand name"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
              />
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Creating account..." : "Create account"}
          </Button>
          <div className="text-center text-sm">
            Already have an account?{" "}
            <Link href={`/login?role=${role}`} className="text-primary hover:underline">
              Login
            </Link>
          </div>
        </CardFooter>
      </form>
    </Card>
  )
}
