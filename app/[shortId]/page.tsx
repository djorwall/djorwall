import { getLinkByShortId, recordClick } from "@/app/actions/links"
import { RedirectPage } from "@/components/redirect-page"
import { notFound } from "next/navigation"

export default async function ShortLinkPage({ params }: { params: { shortId: string } }) {
  const { shortId } = params

  // Get the link from the database
  const { success, data, message } = await getLinkByShortId(shortId)

  if (!success || !data) {
    notFound()
  }

  // Record the click
  await recordClick(data.id)

  return (
    <RedirectPage
      shortId={shortId}
      originalUrl={data.original_url}
      androidUrl={data.android_url}
      iosUrl={data.ios_url}
      fallbackUrl={data.fallback_url || data.original_url}
    />
  )
}
