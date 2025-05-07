import type React from "react"
import Link from "next/link"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <div className="hidden md:block bg-gray-900 relative">
        <div className="absolute inset-0 flex flex-col justify-between p-10 text-white">
          <div>
            <Link href="/" className="text-xl font-bold">
              InfluencerSheets
            </Link>
          </div>
          <div className="space-y-6">
            <h1 className="text-3xl font-bold">Build, Share & Track Your Influencer Network</h1>
            <p className="text-gray-300">
              Create intelligent influencer sheets, track real-time insights, and grow collaborations — all from a
              secure, agent-first platform.
            </p>
            <div className="flex space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Auto-fetch data</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                <span className="text-sm">Real-time updates</span>
              </div>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            © {new Date().getFullYear()} InfluencerSheets. All rights reserved.
          </div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        <img
          src="/placeholder.svg?key=s0a94"
          alt="Influencer Marketing"
          className="h-full w-full object-cover opacity-30"
        />
      </div>
      <div className="flex items-center justify-center p-6">{children}</div>
    </div>
  )
}
