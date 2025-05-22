import Link from "next/link"

export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="container py-6 md:flex md:items-center md:justify-between">
        <div className="text-center md:text-left">
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} Appopener.io. All rights reserved.</p>
        </div>
        <div className="mt-4 flex justify-center md:mt-0">
          <Link href="/privacy" className="text-sm text-gray-500 hover:text-blue-600 mr-4">
            Privacy Policy
          </Link>
          <Link href="/terms" className="text-sm text-gray-500 hover:text-blue-600">
            Terms of Service
          </Link>
        </div>
      </div>
    </footer>
  )
}
