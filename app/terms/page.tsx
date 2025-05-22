import { Card, CardContent } from "@/components/ui/card"

export default function TermsPage() {
  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8 max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight">Terms of Service</h1>
          <p className="mt-2 text-gray-500">Last updated: May 21, 2024</p>
        </div>

        <Card>
          <CardContent className="pt-6 space-y-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
              <p className="text-gray-700 leading-7">
                By accessing or using Appopener.io, you agree to be bound by these Terms of Service. If you do not agree
                to these terms, please do not use our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">2. Description of Service</h2>
              <p className="text-gray-700 leading-7">
                Appopener.io provides a service that allows users to create shortened deep links for native mobile
                applications. Our service includes link creation, analytics, and management tools.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">3. User Responsibilities</h2>
              <p className="text-gray-700 leading-7 mb-2">When using Appopener.io, you agree to:</p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Provide accurate information when creating links</li>
                <li>Not use our service for any illegal or unauthorized purpose</li>
                <li>Not attempt to manipulate or artificially inflate link statistics</li>
                <li>Not distribute malware, viruses, or other harmful code through our links</li>
                <li>Not infringe on the intellectual property rights of others</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">4. Prohibited Content</h2>
              <p className="text-gray-700 leading-7 mb-2">
                You may not use Appopener.io to create links to content that:
              </p>
              <ul className="list-disc pl-6 space-y-1 text-gray-700">
                <li>Is illegal or promotes illegal activities</li>
                <li>Is defamatory, obscene, or offensive</li>
                <li>Infringes on intellectual property rights</li>
                <li>Contains malware, viruses, or other harmful code</li>
                <li>Engages in phishing or other fraudulent activities</li>
                <li>Violates the terms of service of the target application</li>
              </ul>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">5. Intellectual Property</h2>
              <p className="text-gray-700 leading-7">
                All content, features, and functionality of Appopener.io, including but not limited to text, graphics,
                logos, and software, are owned by Appopener.io and are protected by intellectual property laws.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">6. Limitation of Liability</h2>
              <p className="text-gray-700 leading-7">
                Appopener.io is provided "as is" without warranties of any kind. In no event shall Appopener.io be
                liable for any damages, including but not limited to direct, indirect, special, incidental, or
                consequential damages arising out of the use or inability to use our service.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">7. Termination</h2>
              <p className="text-gray-700 leading-7">
                We reserve the right to terminate or suspend your access to Appopener.io at any time, without prior
                notice, for conduct that we believe violates these Terms of Service or is harmful to other users, us, or
                third parties, or for any other reason.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">8. Changes to Terms</h2>
              <p className="text-gray-700 leading-7">
                We may update our Terms of Service from time to time. We will notify you of any changes by posting the
                new Terms of Service on this page and updating the "Last updated" date.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">9. Governing Law</h2>
              <p className="text-gray-700 leading-7">
                These Terms of Service shall be governed by and construed in accordance with the laws of the
                jurisdiction in which Appopener.io operates, without regard to its conflict of law provisions.
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">10. Contact Us</h2>
              <p className="text-gray-700 leading-7">
                If you have any questions about these Terms of Service, please contact us at terms@appopener.io.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
