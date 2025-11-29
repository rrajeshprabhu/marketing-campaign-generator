from fastapi import APIRouter, HTTPException
from typing import List
import uuid
from datetime import datetime

from app.models.campaign import (
    Campaign,
    CampaignCreate,
    CampaignGenerate,
    CampaignFromURL,
    CampaignContent,
    WebsiteAnalysis,
    Platform,
)
from app.services.campaign_service import CampaignService
from app.services.scraper_service import ScraperService
from app.services.ai_service import AIService

router = APIRouter()
campaign_service = CampaignService()
scraper_service = ScraperService()
ai_service = AIService()


@router.post("/generate", response_model=Campaign)
async def generate_campaign(request: CampaignGenerate):
    """Generate a new marketing campaign using AI"""
    try:
        campaign = await campaign_service.generate_campaign(request)
        return campaign
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/generate-from-url", response_model=Campaign)
async def generate_campaign_from_url(request: CampaignFromURL):
    """Generate a marketing campaign by analyzing a website"""
    try:
        # Step 1: Scrape the website
        website_content = await scraper_service.scrape_website(request.website_url)

        # Step 2: Generate campaign content using AI
        platform_values = [p.value for p in request.platforms]
        ai_result = await ai_service.generate_campaign_from_website(
            website_content,
            platform_values,
            request.campaign_type.value
        )

        # Step 3: Build campaign content
        content = []
        for item in ai_result.get("content", []):
            # Map platform string to enum
            platform_str = item.get("platform", "facebook")
            try:
                platform = Platform(platform_str)
            except ValueError:
                platform = Platform.FACEBOOK

            generated_image_url = None
            if request.generate_images:
                prompt = await ai_service.generate_image_prompt(item, website_content.brand_name)
                generated_image_url = await ai_service.generate_image(prompt)

            content.append(CampaignContent(
                platform=platform,
                headline=item.get("headline", ""),
                body=item.get("body", ""),
                hashtags=item.get("hashtags", []),
                call_to_action=item.get("call_to_action", "Learn More"),
                image_suggestions=item.get("image_suggestions", []),
                generated_image_url=generated_image_url
            ))

        # Step 4: Create and save campaign
        campaign = Campaign(
            id=str(uuid.uuid4()),
            name=ai_result.get("campaign_name", f"{website_content.brand_name} Campaign"),
            campaign_type=request.campaign_type,
            product_name=website_content.brand_name,
            target_audience=ai_result.get("target_audience", "General audience"),
            content=content,
            website_url=request.website_url,
            website_images=[img for img in website_content.images[:5]],
            created_at=datetime.utcnow()
        )

        campaign_service._campaigns[campaign.id] = campaign
        return campaign

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/analyze-website", response_model=WebsiteAnalysis)
async def analyze_website(website_url: str):
    """Analyze a website and return extracted content"""
    try:
        content = await scraper_service.scrape_website(website_url)
        return WebsiteAnalysis(
            brand_name=content.brand_name,
            tagline=content.tagline,
            description=content.description,
            products_services=content.products_services,
            key_features=content.key_features,
            images=content.images,
            pages_crawled=content.pages_crawled
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/", response_model=List[Campaign])
async def list_campaigns():
    """List all saved campaigns"""
    return campaign_service.list_campaigns()


@router.get("/{campaign_id}", response_model=Campaign)
async def get_campaign(campaign_id: str):
    """Get a specific campaign by ID"""
    campaign = campaign_service.get_campaign(campaign_id)
    if not campaign:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return campaign


@router.delete("/{campaign_id}")
async def delete_campaign(campaign_id: str):
    """Delete a campaign"""
    success = campaign_service.delete_campaign(campaign_id)
    if not success:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return {"message": "Campaign deleted"}
