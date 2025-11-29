import axios from 'axios'
import type { Campaign, CampaignGenerate } from '../types/campaign'

const api = axios.create({
  baseURL: '/api',
})

export const campaignApi = {
  generate: async (data: CampaignGenerate): Promise<Campaign> => {
    const response = await api.post('/campaigns/generate', data)
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
