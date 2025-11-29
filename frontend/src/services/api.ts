import axios from 'axios'
import type { Campaign, CampaignGenerate, CampaignFromURL } from '../types/campaign'

const api = axios.create({
  baseURL: '/api',
  timeout: 120000, // 2 minutes for scraping
})

export const campaignApi = {
  generate: async (data: CampaignGenerate): Promise<Campaign> => {
    const response = await api.post('/campaigns/generate', data)
    return response.data
  },

  generateFromUrl: async (data: CampaignFromURL): Promise<Campaign> => {
    const response = await api.post('/campaigns/generate-from-url', data)
    return response.data
  },

  list: async (): Promise<Campaign[]> => {
    const response = await api.get('/campaigns/')
    return response.data
  },

  get: async (id: string): Promise<Campaign> => {
    const response = await api.get(`/campaigns/${id}`)
    return response.data
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/campaigns/${id}`)
  },
}
