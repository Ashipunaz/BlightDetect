export default function Footer() {
  return (
    <footer className="bg-gray-800">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-300">
              &copy; {new Date().getFullYear()} BlightDetect. All rights reserved.
            </p>
          </div>
          <div className="mt-4 flex justify-center md:mt-0">
            <p className="text-sm text-gray-300">
              Empowering farmers with AI-powered crop disease detection
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
} 