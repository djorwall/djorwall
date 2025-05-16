import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

export function getSupabaseBrowserClient() {
  return createClientComponentClient<Database>()
}
