from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from enum import Enum


class CampaignType(str, Enum):
    EMAIL = "email"
    SOCIAL_MEDIA = "social_media"
    BLOG = "blog"
    AD_COPY = "ad_copy"
    LANDING_PAGE = "landing_page"


class Platform(str, Enum):
    FACEBOOK = "facebook"
    INSTAGRAM = "instagram"
    TWITTER = "twitter"
    LINKEDIN = "linkedin"
    TIKTOK = "tiktok"
    GOOGLE_ADS = "google_ads"
    EMAIL = "email"


class CampaignGenerate(BaseModel):
    """Request model for generating a campaign"""
    product_name: str
    product_description: str
    target_audience: str
    campaign_type: CampaignType
    platforms: List[Platform]
    tone: str = "professional"
    key_benefits: Optional[List[str]] = None
    call_to_action: Optional[str] = None


class CampaignFromURL(BaseModel):
    """Request model for generating campaign from website URL"""
    website_url: str
    campaign_type: CampaignType = CampaignType.SOCIAL_MEDIA
    platforms: List[Platform] = [Platform.FACEBOOK, Platform.INSTAGRAM, Platform.TWITTER]
    generate_images: bool = False


class WebsiteAnalysis(BaseModel):
    """Website analysis result"""
    brand_name: str
    tagline: str
    description: str
    products_services: List[str]
    key_features: List[str]
    images: List[dict]
    pages_crawled: int


class CampaignContent(BaseModel):
    """Generated content for a specific platform"""
    platform: Platform
    headline: str
    body: str
    hashtags: Optional[List[str]] = None
    call_to_action: str
    image_suggestions: Optional[List[str]] = None
    generated_image_url: Optional[str] = None


class CampaignCreate(BaseModel):
    """Model for creating a campaign manually"""
    name: str
    campaign_type: CampaignType
    content: List[CampaignContent]


class Campaign(BaseModel):
    """Full campaign model"""
    id: str
    name: str
    campaign_type: CampaignType
    product_name: str
    target_audience: str
    content: List[CampaignContent]
    website_url: Optional[str] = None
    website_images: Optional[List[dict]] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
