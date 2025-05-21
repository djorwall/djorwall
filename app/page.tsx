import { UrlShortener } from "@/components/url-shortener"
import { FeatureCard } from "@/components/feature-card"
import { checkUserAuthenticated } from "@/lib/supabase/auth"
import { redirect } from "next/navigation"
import { ArrowRight, BarChart3, Lock, Smartphone } from "lucide-react"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  // Check if user is authenticated
  const isAuthenticated = await checkUserAuthenticated()

  // If authenticated, redirect to dashboard
  if (isAuthenticated) {
    redirect("/dashboard")
  }

  return (
    <div className="container max-w-6xl mx-auto py-12">
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">Simplify Your Links</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Create short, memorable links that redirect anywhere on the web.
        </p>
        <div className="max-w-md mx-auto">
          <UrlShortener />
        </div>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Features</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10" />}
            title="Analytics"
            description="Track clicks and visitor data for all your shortened links."
          />
          <FeatureCard
            icon={<Smartphone className="h-10 w-10" />}
            title="Mobile Detection"
            description="Redirect users to different destinations based on their device."
          />
          <FeatureCard
            icon={<Lock className="h-10 w-10" />}
            title="Password Protection"
            description="Add an extra layer of security to your sensitive links."
          />
        </div>
      </section>

      <section className="text-center bg-gray-50 py-16 rounded-lg">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Create an account to manage your links and access all features.
        </p>
        <Button size="lg" asChild>
          <a href="/login">
            Sign Up Now <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </Button>
      </section>
    </div>
  )
}
