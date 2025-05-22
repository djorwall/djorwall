import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Smartphone, ExternalLink, BarChart3, Shield, Globe } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">About Appopener.io</h1>
          <p className="mt-4 text-lg text-gray-500">The smart way to create deep links for native mobile apps</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <p className="leading-7">
              Appopener.io is a powerful tool that allows you to create smart deep links for native mobile apps like
              YouTube, Instagram, Facebook, and more. Our platform automatically detects the user's device and redirects
              them to the appropriate app or web version, providing a seamless experience for your users.
            </p>
            <p className="leading-7 mt-4">
              Whether you're a marketer looking to drive app engagement, a developer integrating cross-platform links,
              or a content creator sharing your work, Appopener.io provides the tools you need to create effective,
              trackable deep links.
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-blue-600" />
                Smart App Detection
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Our links automatically detect if the user has the app installed and opens it directly, providing a
                seamless experience.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5 text-green-600" />
                Browser Fallback
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                If the app isn't installed, users are redirected to the web version, ensuring they can always access
                your content.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Detailed Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Track clicks, devices, locations, and referrers to understand how your links are performing and optimize
                your strategy.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Secure & Reliable
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500">
                Our platform is built with security in mind, ensuring your links are safe and always available when you
                need them.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-blue-600" />
              Supported Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2">
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                YouTube
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Instagram
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Facebook
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Twitter
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                TikTok
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                Spotify
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                LinkedIn
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                WhatsApp
              </li>
              <li className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-blue-600" />
                And more...
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
