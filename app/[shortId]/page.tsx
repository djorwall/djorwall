import { notFound } from "next/navigation"
import { createServerComponent } from "@/lib/supabase/auth"
import { RedirectPage } from "@/components/redirect-page"

interface RedirectPageProps {
  params: {
    shortId: string
  }
}

export default async function ShortLinkRedirect({ params }: RedirectPageProps) {
  const { shortId } = params

  // Get the original URL from the database
  const supabase = createServerComponent()
  const { data: link } = await supabase.from("links").select("original_url").eq("short_id", shortId).single()

  // If link not found, return 404
  if (!link) {
    notFound()
  }

  return <RedirectPage url={link.original_url} shortId={shortId} />
}
