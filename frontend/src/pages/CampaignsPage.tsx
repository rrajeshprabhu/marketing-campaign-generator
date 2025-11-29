import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { campaignApi } from '../services/api'

export default function CampaignsPage() {
  const queryClient = useQueryClient()

  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: campaignApi.list,
  })

  const deleteMutation = useMutation({
    mutationFn: campaignApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] })
    },
  })

  if (isLoading) {
    return <div className="text-center py-8">Loading campaigns...</div>
  }

  if (!campaigns?.length) {
    return (
      <div className="text-center py-16">
        <h2 className="text-xl font-semibold text-gray-700">No campaigns yet</h2>
        <p className="text-gray-500 mt-2">Generate your first campaign to get started.</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Campaigns</h1>

      <div className="grid gap-6">
        {campaigns.map((campaign) => (
          <div key={campaign.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{campaign.name}</h2>
                <p className="text-gray-500 text-sm">
                  {campaign.campaign_type} • {campaign.target_audience}
                </p>
                <p className="text-gray-400 text-xs mt-1">
                  Created: {new Date(campaign.created_at).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => deleteMutation.mutate(campaign.id)}
                className="text-red-600 hover:text-red-800 text-sm"
              >
                Delete
              </button>
            </div>

            <div className="mt-4 space-y-4">
              {campaign.content.map((content, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded">
                  <h3 className="font-medium capitalize text-indigo-600">{content.platform}</h3>
                  <p className="font-medium mt-1">{content.headline}</p>
                  <p className="text-gray-600 text-sm mt-1">{content.body}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
