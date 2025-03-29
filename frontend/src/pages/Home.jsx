import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function Home() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to BlightDetect
      </h1>
      <p className="text-gray-600 text-lg mb-8">
        Your intelligent crop disease detection system powered by AI
      </p>
      <p className="text-gray-600 mb-12">
        Upload photos of your potato plants and get instant disease detection results with high accuracy.
      </p>

      {!isAuthenticated && (
        <div className="space-x-4">
          <Link
            to="/register"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-500 transition-colors"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="inline-block bg-gray-200 text-gray-800 px-6 py-3 rounded-md font-semibold hover:bg-gray-300 transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {isAuthenticated && (
        <div>
          <Link
            to="/dashboard"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-blue-500 transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>
      )}
    </div>
  )
} 