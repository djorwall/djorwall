import { createServerClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export async function checkAdminAuth() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()

  if (error || !session) {
    redirect("/login?callbackUrl=/admin")
  }

  // Fetch the user's role from the database
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", session.user.id)
    .single()

  if (userError || !userData || userData.role !== "admin") {
    redirect("/unauthorized")
  }

  return {
    user: session.user,
    role: userData.role,
  }
}

export async function getAdminUser() {
  const cookieStore = cookies()
  const supabase = createServerClient(cookieStore)

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    return null
  }

  const { data: userData } = await supabase
    .from("users")
    .select("*")
    .eq("id", session.user.id)
    .eq("role", "admin")
    .single()

  return userData
}
