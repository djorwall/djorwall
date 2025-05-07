import Link from "next/link"
import { Shield } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <div className="mx-auto max-w-md text-center">
        <Shield className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-6 text-3xl font-bold">Access Denied</h1>
        <p className="mt-4 text-gray-500">
          You don't have permission to access this page. Please contact an administrator if you believe this is an
          error.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild variant="outline">
            <Link href="/">Go Home</Link>
          </Button>
          <Button asChild>
            <Link href="/login">Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
