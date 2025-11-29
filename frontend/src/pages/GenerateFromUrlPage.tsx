import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { campaignApi } from '../services/api'
import type { CampaignFromURL, Campaign } from '../types/campaign'

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook', color: 'bg-blue-600', icon: '📘' },
  { id: 'instagram', name: 'Instagram', color: 'bg-gradient-to-r from-purple-500 to-pink-500', icon: '📸' },
  { id: 'twitter', name: 'Twitter/X', color: 'bg-black', icon: '𝕏' },
  { id: 'linkedin', name: 'LinkedIn', color: 'bg-blue-700', icon: '💼' },
  { id: 'tiktok', name: 'TikTok', color: 'bg-black', icon: '🎵' },
]

const CAMPAIGN_TYPES = [
  { id: 'social_media', name: 'Social Media Campaign', icon: '📱' },
  { id: 'email', name: 'Email Marketing', icon: '📧' },
  { id: 'ad_copy', name: 'Ad Copy', icon: '📢' },
  { id: 'blog', name: 'Blog Post', icon: '📝' },
  { id: 'landing_page', name: 'Landing Page', icon: '🌐' },
]

export default function GenerateFromUrlPage() {
  const [generatedCampaign, setGeneratedCampaign] = useState<Campaign | null>(null)
  const [urlFormData, setUrlFormData] = useState<CampaignFromURL>({
    website_url: '',
    campaign_type: 'social_media',
    platforms: ['facebook', 'instagram', 'twitter'],
    generate_images: false,
  })

  const urlMutation = useMutation({
    mutationFn: campaignApi.generateFromUrl,
    onSuccess: (data) => setGeneratedCampaign(data),
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    urlMutation.mutate(urlFormData)
  }

  const togglePlatform = (platformId: string) => {
    const platforms = urlFormData.platforms.includes(platformId as any)
      ? urlFormData.platforms.filter((p) => p !== platformId)
      : [...urlFormData.platforms, platformId as any]
    setUrlFormData({ ...urlFormData, platforms })
  }

  const getPlatformInfo = (id: string) => PLATFORMS.find(p => p.id === id) || PLATFORMS[0]

  return (
    <div className="max-w-6xl mx-auto">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">AI Campaign Generator</h1>
        <p className="text-indigo-100 text-lg">Transform any website into engaging social media campaigns in seconds</p>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg mb-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Website URL</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔗</span>
                <input
                  type="url"
                  required
                  placeholder="https://www.example.com"
                  className="pl-12 w-full rounded-xl border-2 border-gray-200 p-4 text-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition"
                  value={urlFormData.website_url}
                  onChange={(e) => setUrlFormData({ ...urlFormData, website_url: e.target.value })}
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">We'll analyze your website's content, images, and branding</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Campaign Type</label>
              <div className="grid grid-cols-1 gap-2">
                {CAMPAIGN_TYPES.map((type) => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => setUrlFormData({ ...urlFormData, campaign_type: type.id as any })}
                    className={`flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                      urlFormData.campaign_type === type.id
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Target Platforms</label>
              <div className="space-y-2">
                {PLATFORMS.map((platform) => (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => togglePlatform(platform.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-lg border-2 transition ${
                      urlFormData.platforms.includes(platform.id as any)
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <span className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                      {platform.icon}
                    </span>
                    <span className="font-medium">{platform.name}</span>
                    {urlFormData.platforms.includes(platform.id as any) && (
                      <span className="ml-auto text-indigo-600">✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={urlMutation.isPending || urlFormData.platforms.length === 0 || !urlFormData.website_url}
          className="mt-8 w-full py-4 px-6 rounded-xl text-white text-lg font-semibold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
        >
          {urlMutation.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              Analyzing website & generating campaign...
            </span>
          ) : (
            <span className="flex items-center justify-center gap-2">
              <span>✨</span> Generate Campaign
            </span>
          )}
        </button>

        {urlMutation.isError && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            Error generating campaign. Please try again.
          </div>
        )}
      </form>

      {/* Generated Campaign Results */}
      {generatedCampaign && (
        <div className="space-y-8">
          {/* Campaign Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl p-8 text-white">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">🎯</span>
              <span className="text-sm font-medium uppercase tracking-wide opacity-90">Campaign Generated</span>
            </div>
            <h2 className="text-3xl font-bold mb-2">{generatedCampaign.name}</h2>
            <p className="text-green-100">Target Audience: {generatedCampaign.target_audience}</p>
          </div>

          {/* Website Analysis Section */}
          {generatedCampaign.website_images && generatedCampaign.website_images.length > 0 && (
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>🔍</span> Website Analysis
              </h3>
              <p className="text-gray-600 mb-4">We analyzed your website and found these key visual assets:</p>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {generatedCampaign.website_images.map((img, i) => (
                  <div key={i} className="group relative">
                    <img
                      src={img.url}
                      alt={img.alt || 'Website image'}
                      className="w-full h-32 object-cover rounded-xl shadow-md group-hover:shadow-lg transition"
                      onError={(e) => (e.currentTarget.style.display = 'none')}
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 rounded-xl transition flex items-center justify-center">
                      <span className="text-white opacity-0 group-hover:opacity-100 transition">Use in campaign</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Platform Content Cards */}
          <div className="grid md:grid-cols-1 gap-6">
            {generatedCampaign.content.map((content, i) => {
              const platformInfo = getPlatformInfo(content.platform)
              return (
                <div key={i} className="bg-white rounded-2xl shadow-lg overflow-hidden">
                  {/* Platform Header */}
                  <div className={`${platformInfo.color} p-4 text-white`}>
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{platformInfo.icon}</span>
                      <div>
                        <h4 className="font-bold text-lg">{platformInfo.name}</h4>
                        <p className="text-sm opacity-90">Ready to post</p>
                      </div>
                    </div>
                  </div>

                  {/* Content Preview */}
                  <div className="p-6">
                    <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-gray-200">
                      {/* Mock Post Preview */}
                      <div className="flex items-start gap-3 mb-4">
                        <div className={`w-12 h-12 ${platformInfo.color} rounded-full flex items-center justify-center text-white`}>
                          {platformInfo.icon}
                        </div>
                        <div>
                          <p className="font-semibold">Your Brand</p>
                          <p className="text-xs text-gray-500">Just now</p>
                        </div>
                      </div>

                      <h5 className="text-xl font-bold text-gray-900 mb-3">{content.headline}</h5>
                      <p className="text-gray-700 mb-4 whitespace-pre-wrap">{content.body}</p>

                      {content.hashtags && content.hashtags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {content.hashtags.map((tag, j) => (
                            <span key={j} className="text-indigo-600 hover:underline cursor-pointer">{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* CTA Button Preview */}
                      <button className={`${platformInfo.color} text-white px-6 py-2 rounded-lg font-medium shadow hover:shadow-md transition`}>
                        {content.call_to_action}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 mt-4">
                      <button className="flex-1 py-2 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition">
                        📋 Copy Text
                      </button>
                      <button className="flex-1 py-2 px-4 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded-lg font-medium transition">
                        ✏️ Edit
                      </button>
                      <button className={`flex-1 py-2 px-4 ${platformInfo.color} text-white rounded-lg font-medium transition`}>
                        📤 Schedule
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Campaign Summary */}
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-8 border border-indigo-100">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>📊</span> Campaign Summary
            </h3>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-indigo-600">{generatedCampaign.content.length}</div>
                <div className="text-gray-600">Posts Created</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-purple-600">{generatedCampaign.website_images?.length || 0}</div>
                <div className="text-gray-600">Images Found</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-pink-600">
                  {generatedCampaign.content.reduce((acc, c) => acc + (c.hashtags?.length || 0), 0)}
                </div>
                <div className="text-gray-600">Hashtags</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-green-600">Ready</div>
                <div className="text-gray-600">Status</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
