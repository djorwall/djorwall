import { createServerClient } from "@/utils/supabase/server"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { redirect } from "next/navigation"
import UserForm from "../components/user-form"

export default async function EditUserPage({
  params,
}: {
  params: { id: string }
}) {
  const supabase = createServerClient()

  // Fetch user data
  const { data: user } = await supabase.from("users").select("*").eq("id", params.id).single()

  if (!user) {
    redirect("/admin/users")
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Edit User</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm user={user} />
        </CardContent>
      </Card>
    </div>
  )
}
