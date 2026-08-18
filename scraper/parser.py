from bs4 import BeautifulSoup
from config import BASE_URL

def parse_main_menu(html):
    if not html:
        return[]
    soup = BeautifulSoup(html, "html.parser")
    items = []

    for link in soup.find_all("a", href = True):
        href = link["href"]
        if "/menu-item" in href or "recipe=" in href:
            name = link.text.strip()
            full_url = href if href.startswith("http") else f"{BASE_URL}{href}"

            if name and not any(item["url"] == full_url for item in items):
                items.append({"name": name, "url": full_url})

    return items
