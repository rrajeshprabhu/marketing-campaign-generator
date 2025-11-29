import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { campaignApi } from '../services/api'
import type { CampaignGenerate, Campaign } from '../types/campaign'

const PLATFORMS = [
  { id: 'facebook', name: 'Facebook' },
  { id: 'instagram', name: 'Instagram' },
  { id: 'twitter', name: 'Twitter' },
  { id: 'linkedin', name: 'LinkedIn' },
  { id: 'tiktok', name: 'TikTok' },
]

const CAMPAIGN_TYPES = [
  { id: 'social_media', name: 'Social Media' },
  { id: 'email', name: 'Email' },
  { id: 'ad_copy', name: 'Ad Copy' },
  { id: 'blog', name: 'Blog Post' },
  { id: 'landing_page', name: 'Landing Page' },
]

export default function GeneratePage() {
  const [formData, setFormData] = useState<CampaignGenerate>({
    product_name: '',
    product_description: '',
    target_audience: '',
    campaign_type: 'social_media',
    platforms: [],
    tone: 'professional',
    key_benefits: [],
    call_to_action: '',
  })
  const [benefitInput, setBenefitInput] = useState('')
  const [generatedCampaign, setGeneratedCampaign] = useState<Campaign | null>(null)

  const mutation = useMutation({
    mutationFn: campaignApi.generate,
    onSuccess: (data) => {
      setGeneratedCampaign(data)
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    mutation.mutate(formData)
  }

  const addBenefit = () => {
    if (benefitInput.trim()) {
      setFormData({
        ...formData,
        key_benefits: [...(formData.key_benefits || []), benefitInput.trim()],
      })
      setBenefitInput('')
    }
  }

  const togglePlatform = (platformId: string) => {
    const platforms = formData.platforms.includes(platformId as any)
      ? formData.platforms.filter((p) => p !== platformId)
      : [...formData.platforms, platformId as any]
    setFormData({ ...formData, platforms })
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate Campaign</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div>
          <label className="block text-sm font-medium text-gray-700">Product Name</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            value={formData.product_name}
            onChange={(e) => setFormData({ ...formData, product_name: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Product Description</label>
          <textarea
            required
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            value={formData.product_description}
            onChange={(e) => setFormData({ ...formData, product_description: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Target Audience</label>
          <input
            type="text"
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="e.g., Young professionals aged 25-35"
            value={formData.target_audience}
            onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Type</label>
          <select
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            value={formData.campaign_type}
            onChange={(e) => setFormData({ ...formData, campaign_type: e.target.value as any })}
          >
            {CAMPAIGN_TYPES.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <button
                key={platform.id}
                type="button"
                onClick={() => togglePlatform(platform.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  formData.platforms.includes(platform.id as any)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {platform.name}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Key Benefits</label>
          <div className="flex gap-2 mt-1">
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
              value={benefitInput}
              onChange={(e) => setBenefitInput(e.target.value)}
              placeholder="Add a benefit"
            />
            <button
              type="button"
              onClick={addBenefit}
              className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.key_benefits?.map((benefit, i) => (
              <span key={i} className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm">
                {benefit}
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Call to Action</label>
          <input
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-2 border"
            placeholder="e.g., Shop Now, Learn More"
            value={formData.call_to_action}
            onChange={(e) => setFormData({ ...formData, call_to_action: e.target.value })}
          />
        </div>

        <button
          type="submit"
          disabled={mutation.isPending || formData.platforms.length === 0}
          className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {mutation.isPending ? 'Generating...' : 'Generate Campaign'}
        </button>
      </form>

      {generatedCampaign && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-4">Generated Campaign</h2>
          <p className="text-gray-600 mb-4">{generatedCampaign.name}</p>

          <div className="space-y-6">
            {generatedCampaign.content.map((content, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4">
                <h3 className="font-semibold text-lg capitalize">{content.platform}</h3>
                <p className="font-medium mt-2">{content.headline}</p>
                <p className="text-gray-600 mt-1">{content.body}</p>
                {content.hashtags && (
                  <p className="text-indigo-600 mt-2">{content.hashtags.join(' ')}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">CTA: {content.call_to_action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
