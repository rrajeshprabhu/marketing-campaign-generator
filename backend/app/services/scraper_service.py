import asyncio
import re
from typing import List, Optional
from urllib.parse import urljoin, urlparse
from dataclasses import dataclass

import httpx
from bs4 import BeautifulSoup


@dataclass
class PageContent:
    """Content extracted from a single page"""
    url: str
    title: str
    description: str
    headings: List[str]
    paragraphs: List[str]
    images: List[dict]  # {url, alt}
    links: List[str]


@dataclass
class WebsiteContent:
    """Aggregated content from entire website"""
    base_url: str
    brand_name: str
    tagline: str
    description: str
    products_services: List[str]
    key_features: List[str]
    images: List[dict]
    pages_crawled: int


class ScraperService:
    """Service for scraping and extracting content from websites"""

    def __init__(self, max_pages: int = 10):
        self.max_pages = max_pages
        self.visited_urls = set()

    async def scrape_website(self, url: str) -> WebsiteContent:
        """Scrape a website and extract relevant content for marketing"""
        self.visited_urls.clear()
        base_url = self._get_base_url(url)

        # Crawl pages
        pages = await self._crawl_pages(url, base_url)

        # Aggregate content
        return self._aggregate_content(base_url, pages)

    async def _crawl_pages(self, start_url: str, base_url: str) -> List[PageContent]:
        """Crawl multiple pages from the website"""
        pages = []
        urls_to_visit = [start_url]

        async with httpx.AsyncClient(
            follow_redirects=True,
            timeout=30.0,
            headers={
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
            }
        ) as client:
            while urls_to_visit and len(pages) < self.max_pages:
                url = urls_to_visit.pop(0)

                if url in self.visited_urls:
                    continue

                self.visited_urls.add(url)

                try:
                    page_content = await self._scrape_page(client, url, base_url)
                    if page_content:
                        pages.append(page_content)

                        # Add internal links to queue
                        for link in page_content.links:
                            if link not in self.visited_urls and link.startswith(base_url):
                                urls_to_visit.append(link)
                except Exception as e:
                    print(f"Error scraping {url}: {e}")
                    continue

        return pages

    async def _scrape_page(self, client: httpx.AsyncClient, url: str, base_url: str) -> Optional[PageContent]:
        """Scrape a single page"""
        try:
            response = await client.get(url)
            response.raise_for_status()

            soup = BeautifulSoup(response.text, "lxml")

            # Remove script and style elements
            for element in soup(["script", "style", "nav", "footer", "header"]):
                element.decompose()

            # Extract title
            title = ""
            if soup.title:
                title = soup.title.string or ""

            # Extract meta description
            description = ""
            meta_desc = soup.find("meta", attrs={"name": "description"})
            if meta_desc:
                description = meta_desc.get("content", "")

            # Extract headings
            headings = []
            for tag in ["h1", "h2", "h3"]:
                for heading in soup.find_all(tag):
                    text = heading.get_text(strip=True)
                    if text and len(text) > 3:
                        headings.append(text)

            # Extract paragraphs
            paragraphs = []
            for p in soup.find_all("p"):
                text = p.get_text(strip=True)
                if text and len(text) > 50:  # Filter short paragraphs
                    paragraphs.append(text)

            # Extract images
            images = []
            for img in soup.find_all("img"):
                src = img.get("src", "")
                if src:
                    full_url = urljoin(url, src)
                    alt = img.get("alt", "")
                    if self._is_valid_image(full_url):
                        images.append({"url": full_url, "alt": alt})

            # Extract internal links
            links = []
            for a in soup.find_all("a", href=True):
                href = a["href"]
                full_url = urljoin(url, href)
                if full_url.startswith(base_url) and full_url not in links:
                    links.append(full_url)

            return PageContent(
                url=url,
                title=title,
                description=description,
                headings=headings,
                paragraphs=paragraphs[:10],  # Limit paragraphs
                images=images[:20],  # Limit images
                links=links[:20]  # Limit links
            )

        except Exception as e:
            print(f"Error parsing {url}: {e}")
            return None

    def _aggregate_content(self, base_url: str, pages: List[PageContent]) -> WebsiteContent:
        """Aggregate content from multiple pages"""
        if not pages:
            return WebsiteContent(
                base_url=base_url,
                brand_name="",
                tagline="",
                description="",
                products_services=[],
                key_features=[],
                images=[],
                pages_crawled=0
            )

        # Get brand name from first page title
        brand_name = pages[0].title.split("|")[0].split("-")[0].strip() if pages[0].title else ""

        # Aggregate descriptions
        descriptions = [p.description for p in pages if p.description]
        main_description = descriptions[0] if descriptions else ""

        # Aggregate headings as products/services and features
        all_headings = []
        for page in pages:
            all_headings.extend(page.headings)

        # Get unique headings
        unique_headings = list(dict.fromkeys(all_headings))

        # Split into products and features (simple heuristic)
        products_services = unique_headings[:5]
        key_features = unique_headings[5:10]

        # Aggregate paragraphs for tagline
        all_paragraphs = []
        for page in pages:
            all_paragraphs.extend(page.paragraphs)

        tagline = all_paragraphs[0][:150] if all_paragraphs else ""

        # Aggregate images
        all_images = []
        seen_urls = set()
        for page in pages:
            for img in page.images:
                if img["url"] not in seen_urls:
                    seen_urls.add(img["url"])
                    all_images.append(img)

        return WebsiteContent(
            base_url=base_url,
            brand_name=brand_name,
            tagline=tagline,
            description=main_description,
            products_services=products_services,
            key_features=key_features,
            images=all_images[:10],
            pages_crawled=len(pages)
        )

    def _get_base_url(self, url: str) -> str:
        """Get the base URL from a full URL"""
        parsed = urlparse(url)
        return f"{parsed.scheme}://{parsed.netloc}"

    def _is_valid_image(self, url: str) -> bool:
        """Check if URL is a valid image"""
        image_extensions = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg"]
        lower_url = url.lower()

        # Skip tiny images, icons, tracking pixels
        skip_patterns = ["icon", "logo", "favicon", "tracking", "pixel", "1x1", "spacer"]
        for pattern in skip_patterns:
            if pattern in lower_url:
                return False

        return any(ext in lower_url for ext in image_extensions) or "image" in lower_url
