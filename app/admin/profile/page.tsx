import { createServerClient } from "@/utils/supabase/server"
import { checkAdminAuth } from "../auth-utils"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminProfileForm } from "./components/admin-profile-form"
import { ChangePasswordForm } from "./components/change-password-form"

export default async function AdminProfilePage() {
  // Check admin authentication
  const { user } = await checkAdminAuth()

  // Get admin user data
  const supabase = createServerClient()
  const { data: adminUser } = await supabase.from("users").select("*").eq("id", user.id).single()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Admin Profile</h1>
      <p className="text-muted-foreground">Manage your admin account settings and change your password.</p>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your account information and email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <AdminProfileForm user={adminUser} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Change Password</CardTitle>
            <CardDescription>Ensure your account is using a secure password.</CardDescription>
          </CardHeader>
          <CardContent>
            <ChangePasswordForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
