import random
import re
import time
from typing import Dict, List, Optional
from urllib.parse import quote, urlparse

import requests
from bs4 import BeautifulSoup
from requests.adapters import HTTPAdapter, Retry

class ReviewScraperSafe:
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        })
        retries = Retry(total=2, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
        self.session.mount("https://", HTTPAdapter(max_retries=retries))
        self.session.mount("http://", HTTPAdapter(max_retries=retries))

    def extract_company_name(self, url: str) -> str:
        domain = urlparse(url).netloc.replace("www.", "")
        return domain.split(".")[0].title()

    def random_delay(self, min_delay=1, max_delay=2):
        time.sleep(random.uniform(min_delay, max_delay))

    def clean_text(self, text: str) -> str:
        if not text:
            return "N/A"
        text = re.sub(r"\s+", " ", text.strip())
        return text if text else "N/A"

    def fetch_soup(self, url: str) -> Optional[BeautifulSoup]:
        try:
            r = self.session.get(url, timeout=15)
            if r.status_code == 200 and r.text:
                return BeautifulSoup(r.content, "html.parser")
        except Exception:
            return None
        return None

    def parse_reviews(self, soup: BeautifulSoup, source: str, max_reviews: int = 20) -> List[Dict]:
        reviews = []
        containers = soup.select('div.review, article, li.review, div[data-test="review"]') or []
        for container in containers[:max_reviews]:
            try:
                rating = "N/A"
                rating_el = container.select_one('span.rating, div.rating, span[itemprop="ratingValue"]')
                if rating_el:
                    rating = self.clean_text(rating_el.get_text())

                title = "No Title"
                title_el = container.select_one("h2, h3, div.title, span.title")
                if title_el:
                    title = self.clean_text(title_el.get_text())

                pros_elem = container.find(text=re.compile(r"Likes|Pros", re.I))
                pros = self.clean_text(pros_elem.find_next().get_text() if pros_elem and hasattr(pros_elem, "find_next") else "N/A")

                cons_elem = container.find(text=re.compile(r"Dislikes|Cons", re.I))
                cons = self.clean_text(cons_elem.find_next().get_text() if cons_elem and hasattr(cons_elem, "find_next") else "N/A")

                if title != "No Title" or pros != "N/A" or cons != "N/A":
                    reviews.append({"source": source, "rating": rating, "title": title, "pros": pros, "cons": cons})
            except Exception:
                continue
        return reviews

    def scrape_source(self, source: str, company_name: str, max_reviews: int = 20) -> Dict:
        urls = {
            "AmbitionBox": [
                f"https://www.ambitionbox.com/reviews/{company_name.lower().replace(' ', '-')}-reviews",
                f"https://www.ambitionbox.com/reviews/{company_name.lower().replace(' ', '-')}-company-reviews",
            ],
            "Glassdoor": [
                f"https://www.glassdoor.co.in/Reviews/{company_name.replace(' ', '-')}-Reviews-E",
                f"https://www.glassdoor.com/Reviews/{company_name.replace(' ', '-')}-Reviews-E",
            ],
            "Indeed": [
                f"https://www.indeed.com/cmp/{quote(company_name.replace(' ', '-'))}/reviews",
                f"https://in.indeed.com/cmp/{quote(company_name.replace(' ', '-'))}/reviews",
            ],
        }

        for url in urls.get(source, []):
            soup = self.fetch_soup(url)
            if soup:
                reviews = self.parse_reviews(soup, source, max_reviews)
                if reviews:
                    return {"status": "ok", "url": url, "reviews": reviews}
            self.random_delay()

        # IMPORTANT: no fake reviews
        return {"status": "blocked_or_empty", "url": urls.get(source, [None])[0], "reviews": []}

    def scrape_all_sources(self, company_url: str, max_reviews: int = 20) -> Dict:
        company_name = self.extract_company_name(company_url)
        sources = ["AmbitionBox", "Glassdoor", "Indeed"]

        out = {
            "company_name": company_name,
            "company_url": company_url,
            "reviews": {},
            "summary": {"by_source": {}, "total_reviews": 0},
            "statuses": {},
        }

        for s in sources:
            res = self.scrape_source(s, company_name, max_reviews)
            out["reviews"][s.lower()] = res["reviews"]
            out["statuses"][s.lower()] = {"status": res["status"], "url": res["url"]}
            out["summary"]["by_source"][s.lower()] = len(res["reviews"])
            out["summary"]["total_reviews"] += len(res["reviews"])

        return out
