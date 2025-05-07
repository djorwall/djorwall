import Link from "next/link"
import { ArrowRight, BarChart3, Eye, Lock, RefreshCw, Shield, Users } from "lucide-react"

import { Button } from "@/components/ui/button"
import { HeroSection } from "@/components/hero-section"
import { FeatureCard } from "@/components/feature-card"
import { TestimonialSection } from "@/components/testimonial-section"
import { HowItWorks } from "@/components/how-it-works"
import { Footer } from "@/components/footer"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />

        {/* Platform Highlights */}
        <section className="bg-white py-20">
          <div className="container px-4 md:px-6">
            <div className="mb-12 text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">Platform Highlights</h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Everything you need to manage your influencer network effectively
              </p>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              <FeatureCard
                icon={<RefreshCw className="h-10 w-10 text-primary" />}
                title="Auto-Fetch Data"
                description="Automatically fetch influencer data from social media profiles with just a link."
              />
              <FeatureCard
                icon={<BarChart3 className="h-10 w-10 text-primary" />}
                title="Real-Time Analytics"
                description="Track follower counts with automatic updates every 10 days."
              />
              <FeatureCard
                icon={<Eye className="h-10 w-10 text-primary" />}
                title="Viewer Tracking"
                description="Know exactly who viewed your sheets with detailed IP and profile tracking."
              />
              <FeatureCard
                icon={<Users className="h-10 w-10 text-primary" />}
                title="Customizable Fields"
                description="Add up to 20 pricing fields to showcase your influencer offerings."
              />
              <FeatureCard
                icon={<Shield className="h-10 w-10 text-primary" />}
                title="KYC Verification"
                description="Get verified with our blue tick badge to build trust with brands."
              />
              <FeatureCard
                icon={<Lock className="h-10 w-10 text-primary" />}
                title="Advanced Privacy"
                description="Control who sees your sheets with layered access controls and tracking."
              />
            </div>
          </div>
        </section>

        {/* For Agents Section */}
        <section className="bg-gray-50 py-20">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">For Agents</h2>
                <p className="text-lg text-muted-foreground">
                  Take control of your influencer network with powerful tools designed specifically for agents.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Create unlimited influencer sheets with custom fields</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Auto-fetch influencer data from social media profiles</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Track who views your sheets with detailed analytics</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Control access with advanced privacy settings</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Build your professional profile with verified badge</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg">
                    <Link href="/signup?role=agent">Get Started as Agent</Link>
                  </Button>
                </div>
              </div>
              <div className="rounded-lg border bg-white p-2 shadow-lg">
                <img
                  src="/placeholder.svg?key=m1h3r"
                  alt="Agent Dashboard Preview"
                  className="rounded-md object-cover"
                  width={800}
                  height={600}
                />
              </div>
            </div>
          </div>
        </section>

        {/* For Brands Section */}
        <section className="bg-white py-20">
          <div className="container px-4 md:px-6">
            <div className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12">
              <div className="order-2 lg:order-1 rounded-lg border bg-white p-2 shadow-lg">
                <img
                  src="/placeholder.svg?key=y1c11"
                  alt="Brand Dashboard Preview"
                  className="rounded-md object-cover"
                  width={800}
                  height={600}
                />
              </div>
              <div className="order-1 lg:order-2 space-y-4">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">For Brands</h2>
                <p className="text-lg text-muted-foreground">
                  Discover the perfect influencers for your campaigns through verified agent networks.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Browse verified agent profiles and their work</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Request access to curated influencer sheets</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>View real-time follower counts and engagement metrics</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Leave reviews after successful collaborations</span>
                  </li>
                  <li className="flex items-center">
                    <ArrowRight className="mr-2 h-5 w-5 text-primary" />
                    <span>Find the perfect influencers for your specific niche</span>
                  </li>
                </ul>
                <div className="pt-4">
                  <Button asChild size="lg">
                    <Link href="/signup?role=brand">Explore as Brand</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <HowItWorks />
        <TestimonialSection />
      </main>
      <Footer />
    </div>
  )
}
