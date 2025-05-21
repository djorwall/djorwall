import { createActionClient } from "@/lib/supabase/auth"

/**
 * Creates a server action client
 * @returns A Supabase client for server actions
 */
export function createServerActionClient() {
  return createActionClient()
}
