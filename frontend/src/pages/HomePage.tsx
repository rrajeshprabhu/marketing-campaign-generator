import { Link } from 'react-router-dom'

export default function HomePage() {
  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Marketing Campaign Generator
      </h1>
      <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
        Generate compelling marketing campaigns for your products using AI.
        Create content for social media, email, ads, and more in seconds.
      </p>
      <div className="space-x-4">
        <Link
          to="/generate"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Create Campaign
        </Link>
        <Link
          to="/campaigns"
          className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          View Campaigns
        </Link>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Multi-Platform</h3>
          <p className="text-gray-600">
            Generate content for Facebook, Instagram, Twitter, LinkedIn, and more.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">AI-Powered</h3>
          <p className="text-gray-600">
            Leverage advanced AI to create engaging, targeted marketing copy.
          </p>
        </div>
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Save & Export</h3>
          <p className="text-gray-600">
            Save your campaigns and export them for immediate use.
          </p>
        </div>
      </div>
    </div>
  )
}
