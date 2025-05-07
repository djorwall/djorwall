import { checkAdminAuth } from "../auth-utils"
import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

export default async function VerificationsPage() {
  // Check if user is authenticated and is an admin
  await checkAdminAuth()

  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  // Get unverified agents
  const { data: unverifiedAgents } = await supabase
    .from("agent_profiles")
    .select(`
      id,
      company_name,
      location,
      bio,
      avatar_url,
      created_at,
      user_id,
      users (
        email,
        full_name
      )
    `)
    .eq("is_verified", false)
    .order("created_at", { ascending: false })

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Agent Verifications</h1>
        <Link href="/admin">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>

      <p className="text-gray-500">Review and verify agent accounts.</p>

      <div className="grid grid-cols-1 gap-6">
        {unverifiedAgents && unverifiedAgents.length > 0 ? (
          unverifiedAgents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {agent.avatar_url ? (
                      <img
                        src={agent.avatar_url || "/placeholder.svg"}
                        alt={agent.company_name || "Agent"}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500 text-lg">{(agent.company_name || "A").charAt(0)}</span>
                      </div>
                    )}
                    <div>
                      <CardTitle>{agent.company_name || "Unnamed Agent"}</CardTitle>
                      <CardDescription>
                        {agent.users?.email || "No email"} • {agent.location || "No location"}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                    Pending Verification
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">{agent.bio || "No bio provided"}</p>
                <div className="flex space-x-2">
                  <form action={`/admin/api/verify-agent?id=${agent.id}`} method="POST">
                    <Button type="submit" className="bg-green-600 hover:bg-green-700">
                      Verify Agent
                    </Button>
                  </form>
                  <Link href={`/admin/agents/${agent.id}`}>
                    <Button variant="outline">View Details</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium">No pending verifications</h3>
            <p className="text-gray-500">All agents have been verified.</p>
          </div>
        )}
      </div>
    </div>
  )
}
