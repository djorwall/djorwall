import type { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface DashboardCardProps {
  title: string
  value: string | number
  icon: ReactNode
  change?: {
    value: number
    isPositive: boolean
  }
  footer?: {
    text: string
    href: string
  }
}

export function DashboardCard({ title, value, icon, change, footer }: DashboardCardProps) {
  const formattedValue = typeof value === "number" ? value.toLocaleString() : value

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {change && (
          <div className="flex items-center text-xs text-muted-foreground">
            <span className={`flex items-center ${change.isPositive ? "text-green-500" : "text-red-500"}`}>
              {change.isPositive ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.577 4.878a.75.75 0 01.919-.53l4.78 1.281a.75.75 0 01.531.919l-1.281 4.78a.75.75 0 01-1.449-.387l.81-3.022a19.407 19.407 0 00-5.594 5.203.75.75 0 01-1.139.093L7 10.06l-4.72 4.72a.75.75 0 01-1.06-1.061l5.25-5.25a.75.75 0 011.06 0l3.074 3.073a20.923 20.923 0 015.545-4.931l-3.042-.815a.75.75 0 01-.53-.919z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="mr-1 h-4 w-4"
                >
                  <path
                    fillRule="evenodd"
                    d="M1.22 5.222a.75.75 0 011.06 0L7 9.942l3.768-3.769a.75.75 0 011.113.058 20.908 20.908 0 013.813 7.254l1.574-2.727a.75.75 0 011.3.75l-2.475 4.286a.75.75 0 01-.998.282l-4.286-2.475a.75.75 0 01.75-1.3l2.322 1.342a19.422 19.422 0 00-3.4-6.424L7 10.942l-4.72-4.72a.75.75 0 010-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
              {Math.abs(change.value)}%
            </span>
            <span className="ml-1">from last month</span>
          </div>
        )}
      </CardContent>
      {footer && (
        <CardFooter className="p-2">
          <Button variant="ghost" size="sm" className="w-full justify-between" asChild>
            <a href={footer.href}>
              <span>{footer.text}</span>
              <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
        </CardFooter>
      )}
    </Card>
  )
}
