from fastapi import APIRouter, HTTPException
from typing import List

from app.models.campaign import Campaign, CampaignCreate, CampaignGenerate
from app.services.campaign_service import CampaignService

router = APIRouter()
campaign_service = CampaignService()


@router.post("/generate", response_model=Campaign)
async def generate_campaign(request: CampaignGenerate):
    """Generate a new marketing campaign using AI"""
    try:
        campaign = await campaign_service.generate_campaign(request)
        return campaign
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
