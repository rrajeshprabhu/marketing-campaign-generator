import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { campaignApi } from '../services/api'
import type { CampaignFromURL, Campaign } from '../types/campaign'

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

  const btnClass = (selected: boolean) => 
    selected ? 'px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white' 
             : 'px-4 py-2 rounded-full text-sm font-medium bg-gray-200 text-gray-700'

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Generate from Website</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow">
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm text-indigo-800">Enter your website URL and we will analyze it to create marketing campaigns.</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website URL</label>
          <input type="url" required placeholder="https://www.example.com" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-3 border text-lg" value={urlFormData.website_url} onChange={(e) => setUrlFormData({ ...urlFormData, website_url: e.target.value })} />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Campaign Type</label>
          <select className="mt-1 block w-full rounded-md border-gray-300 shadow-sm p-2 border" value={urlFormData.campaign_type} onChange={(e) => setUrlFormData({ ...urlFormData, campaign_type: e.target.value as any })}>
            {CAMPAIGN_TYPES.map((type) => (<option key={type.id} value={type.id}>{type.name}</option>))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Platforms</label>
          <div className="flex flex-wrap gap-2">
            {PLATFORMS.map((platform) => (
              <button key={platform.id} type="button" onClick={() => togglePlatform(platform.id)} className={btnClass(urlFormData.platforms.includes(platform.id as any))}>{platform.name}</button>
            ))}
          </div>
        </div>

        <button type="submit" disabled={urlMutation.isPending || urlFormData.platforms.length === 0 || !urlFormData.website_url} className="w-full py-3 px-4 rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50">
          {urlMutation.isPending ? 'Analyzing website...' : 'Generate Campaign'}
        </button>

        {urlMutation.isError && (<div className="p-4 bg-red-50 text-red-700 rounded-lg">Error generating campaign.</div>)}
      </form>

      {generatedCampaign && (
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-bold mb-2">{generatedCampaign.name}</h2>
          <p className="text-gray-500 text-sm mb-4">Target: {generatedCampaign.target_audience}</p>
          
          {generatedCampaign.website_images && generatedCampaign.website_images.length > 0 && (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Images from Website</h3>
              <div className="flex gap-2 overflow-x-auto pb-2">
                {generatedCampaign.website_images.map((img, i) => (
                  <img key={i} src={img.url} alt={img.alt || 'Image'} className="h-24 w-24 object-cover rounded-lg" onError={(e) => (e.currentTarget.style.display = 'none')} />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {generatedCampaign.content.map((content, i) => (
              <div key={i} className="border-l-4 border-indigo-500 pl-4 py-2">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-sm font-semibold">{content.platform}</span>
                <p className="font-medium mt-2 text-lg">{content.headline}</p>
                <p className="text-gray-600 mt-1">{content.body}</p>
                {content.hashtags && content.hashtags.length > 0 && (<p className="text-indigo-600 mt-2 text-sm">{content.hashtags.join(' ')}</p>)}
                <p className="text-sm text-gray-500 mt-2">CTA: {content.call_to_action}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
