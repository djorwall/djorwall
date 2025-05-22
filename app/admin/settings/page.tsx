export const metadata = {
  title: "Admin Settings | AppOpener",
  description: "Configure application settings for AppOpener",
}

import { SettingsManagement } from "@/components/admin/settings-management"

export default function SettingsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Settings</h2>
      </div>
      <SettingsManagement />
    </div>
  )
}
