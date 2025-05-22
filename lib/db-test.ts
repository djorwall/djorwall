import { createServerSupabaseClient } from "./supabase"

export async function testDatabaseConnection() {
  try {
    const supabase = createServerSupabaseClient()

    // Test query to check if tables exist
    const { data: linksTable, error: linksError } = await supabase.from("links").select("id").limit(1)

    if (linksError) {
      console.error("Error checking links table:", linksError)
      return { success: false, error: linksError.message }
    }

    const { data: analyticsTable, error: analyticsError } = await supabase.from("analytics").select("id").limit(1)

    if (analyticsError) {
      console.error("Error checking analytics table:", analyticsError)
      return { success: false, error: analyticsError.message }
    }

    return {
      success: true,
      message: "Database connection successful and tables exist",
      linksTable: !!linksTable,
      analyticsTable: !!analyticsTable,
    }
  } catch (error) {
    console.error("Database connection test failed:", error)
    return { success: false, error: String(error) }
  }
}
