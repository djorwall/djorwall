import { redirect } from "next/navigation"
import { checkUserAuthenticated, getCurrentUser } from "@/lib/supabase/auth"
import { Button } from "@/components/ui/button"
import { signOut } from "@/app/actions/auth"
import { LinksTable } from "@/components/dashboard/links-table"
import { createActionClient } from "@/lib/supabase/auth"

export default async function DashboardPage() {
  // Check if user is authenticated
  const isAuthenticated = await checkUserAuthenticated()

  if (!isAuthenticated) {
    redirect("/login")
  }

  // Get current user
  const user = await getCurrentUser()

  // Get user's links
  const supabase = createActionClient()
  const { data: links } = await supabase
    .from("links")
    .select("*")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false })

  return (
    <div className="container max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Sign Out
          </Button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Your Links</h2>
        {links && links.length > 0 ? (
          <LinksTable links={links} />
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">You haven't created any links yet.</p>
            <Button className="mt-4" asChild>
              <a href="/">Create Your First Link</a>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
