import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import UserForm from "../components/user-form"

export default function NewUserPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Create New User</h1>

      <Card>
        <CardHeader>
          <CardTitle>User Details</CardTitle>
        </CardHeader>
        <CardContent>
          <UserForm />
        </CardContent>
      </Card>
    </div>
  )
}
