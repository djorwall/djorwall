import type { LucideIcon } from "lucide-react"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  iconColor?: string
}

export function FeatureCard({ icon: Icon, title, description, iconColor = "text-primary" }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center p-6 text-center bg-white rounded-lg border shadow-sm">
      <div className={`mb-4 ${iconColor}`}>
        <Icon className="h-8 w-8" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  )
}
