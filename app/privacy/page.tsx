import { Card, CardContent } from "@/components/ui/card"

export default function PrivacyPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Privacy Policy</h1>
          <p className="mt-2 text-gray-500">Last updated: May 21, 2024</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Introduction</h2>
              <p className="text-gray-700 leading-7">
                Welcome to Appopener.io's Privacy Policy. This Privacy Policy describes how we collect, use, and share
                your information when you use our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">2. Information We Collect</h2>
              <p className="text-gray-700 leading-7 mb-2">
                When you use Appopener.io, we collect the following types of information:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Link information (original URL, shortened URL)</li>
                <li>Usage data (clicks, timestamps)</li>
                <li>Device information (device type, operating system)</li>
                <li>IP address and location data</li>
                <li>Referrer information</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. How We Use Your Information</h2>
              <p className="text-gray-700 leading-7 mb-2">We use the information we collect to:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Provide and maintain our service</li>
                <li>Improve and personalize your experience</li>
                <li>Generate analytics and statistics</li>
                <li>Detect and prevent fraud and abuse</li>
                <li>Communicate with you about our service</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">4. Sharing Your Information</h2>
              <p className="text-gray-700 leading-7">
                We may share your information with third parties in the following circumstances:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>With service providers who help us operate our service</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights, privacy, safety, or property</li>
                <li>In connection with a business transfer or transaction</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">5. Your Rights</h2>
              <p className="text-gray-700 leading-7">
                Depending on your location, you may have certain rights regarding your personal information, including
                the right to access, correct, delete, or restrict processing of your personal information.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">6. Security</h2>
              <p className="text-gray-700 leading-7">
                We implement appropriate technical and organizational measures to protect your personal information
                against unauthorized or unlawful processing, accidental loss, destruction, or damage.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">7. Changes to This Privacy Policy</h2>
              <p className="text-gray-700 leading-7">
                We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new
                Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">8. Contact Us</h2>
              <p className="text-gray-700 leading-7">
                If you have any questions about this Privacy Policy, please contact us at privacy@appopener.io.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
