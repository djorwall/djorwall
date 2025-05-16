import { Smartphone, ExternalLink, BarChart3 } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { UrlShortener } from "@/components/url-shortener"
import { FeatureCard } from "@/components/feature-card"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F9FAFB]">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24">
          <div className="container text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Smart Links for <span className="text-primary">Native Apps</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto">
              Create shortened smart deeplinks that open in native apps with integrated analytics
            </p>

            <UrlShortener />
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white border-t">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FeatureCard
                icon={Smartphone}
                title="Smart App Detection"
                description="Automatically opens in native apps when installed on user devices"
              />
              <FeatureCard
                icon={ExternalLink}
                title="Browser Fallback"
                description="Seamlessly redirects to web version when native app isn't available"
                iconColor="text-accent"
              />
              <FeatureCard
                icon={BarChart3}
                title="Analytics Included"
                description="Track clicks, devices, locations and more with detailed analytics"
                iconColor="text-purple-500"
              />
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 bg-white">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-muted-foreground">© 2025 Appopener.io. All rights reserved.</div>
            <div className="flex gap-6 mt-4 md:mt-0">
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Terms
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Privacy
              </a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
