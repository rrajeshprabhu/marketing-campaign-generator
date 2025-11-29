import os
import json
from typing import Optional
from anthropic import Anthropic
from openai import OpenAI

from app.services.scraper_service import WebsiteContent


class AIService:
    """Service for AI-powered content generation"""

    def __init__(self):
        self.anthropic_key = os.getenv("ANTHROPIC_API_KEY")
        self.openai_key = os.getenv("OPENAI_API_KEY")

        print(f"[AI Service] OpenAI Key present: {bool(self.openai_key)}")
        print(f"[AI Service] Anthropic Key present: {bool(self.anthropic_key)}")

        self.anthropic = Anthropic(api_key=self.anthropic_key) if self.anthropic_key else None
        self.openai = OpenAI(api_key=self.openai_key) if self.openai_key else None

        print(f"[AI Service] OpenAI client: {self.openai is not None}")

    async def generate_campaign_from_website(
        self,
        website_content: WebsiteContent,
        platforms: list,
        campaign_type: str
    ) -> dict:
        """Generate marketing campaign content from website analysis"""

        # Build context from website content
        context = self._build_context(website_content)

        # Generate campaign using available AI
        print(f"[AI Service] Generating campaign - Anthropic: {self.anthropic is not None}, OpenAI: {self.openai is not None}")
        if self.anthropic:
            print("[AI Service] Using Claude...")
            return await self._generate_with_claude(context, platforms, campaign_type)
        elif self.openai:
            print("[AI Service] Using OpenAI...")
            return await self._generate_with_openai(context, platforms, campaign_type)
        else:
            print("[AI Service] Using fallback templates...")
            # Fallback to template-based generation
            return self._generate_fallback(website_content, platforms, campaign_type)

    def _build_context(self, website_content: WebsiteContent) -> str:
        """Build context string from website content"""
        return f"""
Website Analysis:
- Brand Name: {website_content.brand_name}
- Website: {website_content.base_url}
- Tagline: {website_content.tagline}
- Description: {website_content.description}
- Products/Services: {', '.join(website_content.products_services)}
- Key Features: {', '.join(website_content.key_features)}
- Pages Analyzed: {website_content.pages_crawled}
- Available Images: {len(website_content.images)} images found
"""

    async def _generate_with_claude(self, context: str, platforms: list, campaign_type: str) -> dict:
        """Generate campaign using Claude"""
        prompt = f"""Based on the following website analysis, create a compelling {campaign_type} marketing campaign for these platforms: {', '.join(platforms)}.

{context}

For each platform, provide:
1. A catchy headline (under 60 characters)
2. Engaging body copy (platform-appropriate length)
3. Relevant hashtags (for social media)
4. A clear call-to-action
5. Image suggestions based on the brand

Return the response as JSON with this structure:
{{
    "campaign_name": "Campaign name",
    "target_audience": "Identified target audience",
    "content": [
        {{
            "platform": "platform_name",
            "headline": "headline text",
            "body": "body copy",
            "hashtags": ["tag1", "tag2"],
            "call_to_action": "CTA text",
            "image_suggestions": ["suggestion1", "suggestion2"]
        }}
    ]
}}
"""

        try:
            response = self.anthropic.messages.create(
                model="claude-sonnet-4-20250514",
                max_tokens=2000,
                messages=[{"role": "user", "content": prompt}]
            )

            # Parse JSON from response
            content = response.content[0].text

            # Try to extract JSON from the response
            json_match = content
            if "```json" in content:
                json_match = content.split("```json")[1].split("```")[0]
            elif "```" in content:
                json_match = content.split("```")[1].split("```")[0]

            return json.loads(json_match.strip())

        except Exception as e:
            print(f"Claude error: {e}")
            return self._generate_fallback_from_context(context, platforms, campaign_type)

    async def _generate_with_openai(self, context: str, platforms: list, campaign_type: str) -> dict:
        """Generate campaign using OpenAI"""
        prompt = f"""Based on the following website analysis, create a compelling {campaign_type} marketing campaign for these platforms: {', '.join(platforms)}.

{context}

For each platform, provide:
1. A catchy headline (under 60 characters)
2. Engaging body copy (platform-appropriate length)
3. Relevant hashtags (for social media)
4. A clear call-to-action
5. Image suggestions based on the brand

Return ONLY valid JSON with this structure:
{{
    "campaign_name": "Campaign name",
    "target_audience": "Identified target audience",
    "content": [
        {{
            "platform": "platform_name",
            "headline": "headline text",
            "body": "body copy",
            "hashtags": ["tag1", "tag2"],
            "call_to_action": "CTA text",
            "image_suggestions": ["suggestion1", "suggestion2"]
        }}
    ]
}}
"""

        try:
            response = self.openai.chat.completions.create(
                model="gpt-4o-mini",
                messages=[{"role": "user", "content": prompt}],
                response_format={"type": "json_object"}
            )

            return json.loads(response.choices[0].message.content)

        except Exception as e:
            print(f"OpenAI error: {e}")
            return self._generate_fallback_from_context(context, platforms, campaign_type)

    def _generate_fallback(self, website_content: WebsiteContent, platforms: list, campaign_type: str) -> dict:
        """Generate campaign without AI (template-based)"""
        brand = website_content.brand_name or "Your Brand"
        tagline = website_content.tagline[:100] if website_content.tagline else "Discover our amazing products"

        content = []
        for platform in platforms:
            platform_content = {
                "platform": platform,
                "headline": f"Discover {brand} Today!",
                "body": f"{tagline} Visit {website_content.base_url} to learn more about what makes us special.",
                "hashtags": [f"#{brand.replace(' ', '')}", "#Marketing", "#Discover"],
                "call_to_action": "Visit Our Website",
                "image_suggestions": [
                    f"Hero image showcasing {brand}",
                    "Product/service highlight",
                    "Customer testimonial visual"
                ]
            }

            # Customize by platform
            if platform == "twitter":
                platform_content["body"] = platform_content["body"][:200]
            elif platform == "instagram":
                platform_content["hashtags"].extend(["#InstaMarketing", "#BrandSpotlight"])
            elif platform == "linkedin":
                platform_content["body"] = f"Looking for professional solutions? {tagline}"
                platform_content["hashtags"] = ["#Business", "#Professional", "#Innovation"]

            content.append(platform_content)

        return {
            "campaign_name": f"{brand} - {campaign_type.replace('_', ' ').title()} Campaign",
            "target_audience": "General audience interested in " + ", ".join(website_content.products_services[:3]) if website_content.products_services else "our products",
            "content": content
        }

    def _generate_fallback_from_context(self, context: str, platforms: list, campaign_type: str) -> dict:
        """Fallback generation when AI fails"""
        # Extract brand name from context
        brand = "Your Brand"
        for line in context.split("\n"):
            if "Brand Name:" in line:
                brand = line.split(":")[-1].strip()
                break

        content = []
        for platform in platforms:
            content.append({
                "platform": platform,
                "headline": f"Discover {brand}",
                "body": f"Experience what {brand} has to offer. Quality products and services tailored for you.",
                "hashtags": [f"#{brand.replace(' ', '')}", "#Marketing"],
                "call_to_action": "Learn More",
                "image_suggestions": ["Brand hero image", "Product showcase"]
            })

        return {
            "campaign_name": f"{brand} Campaign",
            "target_audience": "General audience",
            "content": content
        }

    async def generate_image_prompt(self, campaign_content: dict, brand_name: str) -> str:
        """Generate a DALL-E prompt for campaign imagery"""
        return f"Professional marketing image for {brand_name}. Modern, clean design with vibrant colors. Suitable for social media advertising. High quality, photorealistic."

    async def generate_image(self, prompt: str) -> Optional[str]:
        """Generate an image using DALL-E"""
        if not self.openai:
            return None

        try:
            response = self.openai.images.generate(
                model="dall-e-3",
                prompt=prompt,
                size="1024x1024",
                quality="standard",
                n=1
            )
            return response.data[0].url
        except Exception as e:
            print(f"Image generation error: {e}")
            return None
