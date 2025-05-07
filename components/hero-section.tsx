import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-b from-gray-50 to-white py-20 md:py-32">
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
          <div className="flex flex-col justify-center space-y-4">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Build, Share & Track Your Influencer Network. Smarter. Safer. Faster.
              </h1>
              <p className="max-w-[600px] text-gray-500 md:text-xl">
                Create intelligent influencer sheets, track real-time insights, and grow collaborations — all from a
                secure, agent-first platform.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row">
              <Button asChild size="lg" className="gap-1">
                <Link href="/signup?role=agent">
                  Get Started as Agent
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/signup?role=brand">Explore as Brand</Link>
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Auto-fetch data</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Real-time updates</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="h-2 w-2 rounded-full bg-green-500" />
                <span>Viewer tracking</span>
              </div>
            </div>
          </div>
          <div className="relative mx-auto aspect-video overflow-hidden rounded-xl border bg-background shadow-xl lg:aspect-square lg:w-full">
            <img
              src="/placeholder.svg?key=6s4ov"
              alt="Influencer Sheet Dashboard"
              className="object-cover"
              width={800}
              height={800}
            />
          </div>
        </div>
      </div>
    </section>
  )
}
