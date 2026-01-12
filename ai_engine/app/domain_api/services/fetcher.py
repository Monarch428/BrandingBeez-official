import httpx
from bs4 import BeautifulSoup

async def fetch_website(url: str):
    async with httpx.AsyncClient(
        follow_redirects=True,
        timeout=20,
        headers={"User-Agent": "Mozilla/5.0"}
    ) as client:
        response = await client.get(url)

    html = response.text
    headers = dict(response.headers)

    soup = BeautifulSoup(html, "html.parser")

    scripts = []
    for s in soup.find_all("script"):
        if s.get("src"):
            scripts.append(s.get("src"))
        elif s.string:
            scripts.append(s.string[:200])

    cookies = list(response.cookies.keys())

    return {
        "url": str(response.url),
        "html": html,
        "headers": headers,
        "scripts": scripts,
        "cookies": cookies
    }
