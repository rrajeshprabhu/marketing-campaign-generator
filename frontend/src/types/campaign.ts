export type CampaignType = 'email' | 'social_media' | 'blog' | 'ad_copy' | 'landing_page'

export type Platform = 'facebook' | 'instagram' | 'twitter' | 'linkedin' | 'tiktok' | 'google_ads' | 'email'

export interface CampaignGenerate {
  product_name: string
  product_description: string
  target_audience: string
  campaign_type: CampaignType
  platforms: Platform[]
  tone?: string
  key_benefits?: string[]
  call_to_action?: string
}

export interface CampaignFromURL {
  website_url: string
  campaign_type: CampaignType
  platforms: Platform[]
  generate_images?: boolean
}

export interface CampaignContent {
  platform: Platform
  headline: string
  body: string
  hashtags?: string[]
  call_to_action: string
  image_suggestions?: string[]
  generated_image_url?: string
}

export interface Campaign {
  id: string
  name: string
  campaign_type: CampaignType
  product_name: string
  target_audience: string
  content: CampaignContent[]
  website_url?: string
  website_images?: { url: string; alt: string }[]
  created_at: string
  updated_at?: string
}
