import uuid
from datetime import datetime
from typing import List, Optional

from app.models.campaign import (
    Campaign,
    CampaignGenerate,
    CampaignContent,
)


class CampaignService:
    """Service for managing marketing campaigns"""

    def __init__(self):
        # In-memory storage (replace with database in production)
        self._campaigns: dict[str, Campaign] = {}

    async def generate_campaign(self, request: CampaignGenerate) -> Campaign:
        """Generate a marketing campaign using AI"""
        campaign_id = str(uuid.uuid4())

        # Generate content for each platform
        content = []
        for platform in request.platforms:
            # TODO: Integrate with AI service (OpenAI, Claude, etc.)
            # For now, return placeholder content
            platform_content = CampaignContent(
                platform=platform,
                headline=f"Discover {request.product_name} - {request.key_benefits[0] if request.key_benefits else 'Your Solution'}",
                body=f"Introducing {request.product_name}. {request.product_description} Perfect for {request.target_audience}.",
                hashtags=self._generate_hashtags(request.product_name, platform),
                call_to_action=request.call_to_action or "Learn More",
                image_suggestions=[
                    f"Product hero shot of {request.product_name}",
                    f"Lifestyle image showing {request.target_audience} using the product",
                    "Brand colors background with key benefits overlay"
                ]
            )
            content.append(platform_content)

        campaign = Campaign(
            id=campaign_id,
            name=f"{request.product_name} - {request.campaign_type.value} Campaign",
            campaign_type=request.campaign_type,
            product_name=request.product_name,
            target_audience=request.target_audience,
            content=content,
            created_at=datetime.utcnow()
        )

        self._campaigns[campaign_id] = campaign
        return campaign

    def _generate_hashtags(self, product_name: str, platform) -> List[str]:
        """Generate relevant hashtags for social media"""
        base_hashtags = [
            f"#{product_name.replace(' ', '')}",
            "#Marketing",
            "#NewProduct",
        ]

        platform_hashtags = {
            "instagram": ["#InstaMarketing", "#BrandAwareness"],
            "twitter": ["#Launch", "#Innovation"],
            "linkedin": ["#B2B", "#BusinessGrowth"],
            "tiktok": ["#ForYou", "#Trending"],
        }

        return base_hashtags + platform_hashtags.get(platform.value, [])

    def list_campaigns(self) -> List[Campaign]:
        """List all campaigns"""
        return list(self._campaigns.values())

    def get_campaign(self, campaign_id: str) -> Optional[Campaign]:
        """Get a campaign by ID"""
        return self._campaigns.get(campaign_id)

    def delete_campaign(self, campaign_id: str) -> bool:
        """Delete a campaign"""
        if campaign_id in self._campaigns:
            del self._campaigns[campaign_id]
            return True
        return False
