import { getSafeRedirectUrl as getRedirectUrl } from "@/lib/supabase/auth"

/**
 * Gets a safe redirect URL
 * @param url The URL to validate
 * @returns A safe URL to redirect to
 */
export function getSafeRedirectUrl(url: string | null | undefined): string {
  return getRedirectUrl(url)
}
