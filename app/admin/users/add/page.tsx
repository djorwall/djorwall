import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AddUserForm } from "../components/add-user-form"
import { checkAdminAuth } from "../../auth-utils"

export default async function AddUserPage() {
  // Check admin authentication
  await checkAdminAuth()

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Add User</h1>
      <p className="text-muted-foreground">
        Create a new user account directly. The user will be created with a verified email and can log in immediately.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
          <CardDescription>Enter the details for the new user</CardDescription>
        </CardHeader>
        <CardContent>
          <AddUserForm />
        </CardContent>
      </Card>
    </div>
  )
}
