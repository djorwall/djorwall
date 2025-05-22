import { Smartphone, ExternalLink, BarChart3 } from "lucide-react"

export function FeatureSection() {
  return (
    <section className="w-full py-12 bg-gray-50">
      <div className="container px-4 md:px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-blue-600 mb-4">
              <Smartphone className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Smart App Detection</h3>
            <p className="text-sm text-gray-500">Automatically opens in native apps when installed on user devices</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-600 mb-4">
              <ExternalLink className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Browser Fallback</h3>
            <p className="text-sm text-gray-500">Seamlessly redirects to web version when native app isn't available</p>
          </div>
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-purple-600 mb-4">
              <BarChart3 className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Analytics Included</h3>
            <p className="text-sm text-gray-500">Track clicks, devices, locations and more with detailed analytics</p>
          </div>
        </div>
      </div>
    </section>
  )
}
