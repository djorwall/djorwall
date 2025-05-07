import { CheckCircle2, PenLine, Search } from "lucide-react"

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-gray-50 py-20">
      <div className="container px-4 md:px-6">
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Simple steps to manage your influencer network effectively
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <PenLine className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">1. Create Your Sheets</h3>
            <p className="text-muted-foreground">
              Build custom influencer sheets with auto-fetched data from social media profiles. Add pricing, categories,
              and custom fields.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Search className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">2. Share With Brands</h3>
            <p className="text-muted-foreground">
              Control who sees your sheets with advanced privacy settings. Track every view with detailed analytics.
            </p>
          </div>
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <CheckCircle2 className="h-8 w-8 text-primary" />
            </div>
            <h3 className="mb-2 text-xl font-bold">3. Grow Your Network</h3>
            <p className="text-muted-foreground">
              Build your reputation with verified profiles, ratings, and reviews. Showcase your past work to attract new
              brands.
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
