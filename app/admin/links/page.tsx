import { LinkManagement } from "@/components/admin/link-management"

export default function LinksPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Link Management</h2>
      </div>
      <LinkManagement />
    </div>
  )
}
