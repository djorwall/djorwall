import { LinkGenerator } from "@/components/link-generator"
import { FeatureSection } from "@/components/feature-section"

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      <section className="w-full py-12 md:py-24 lg:py-32">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Smart Links for <span className="text-blue-600">Native Apps</span>
            </h1>
            <p className="max-w-[700px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Create shortened smart deeplinks that open in native apps with integrated analytics
            </p>
          </div>
          <div className="mx-auto mt-12 grid w-full max-w-lg gap-6">
            <LinkGenerator />
          </div>
        </div>
      </section>
      <FeatureSection />
    </div>
  )
}
