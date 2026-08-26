import re
from bs4 import BeautifulSoup
from config import BASE_URL

def parse_main_menu(html):
    if not html:
        return []

    soup = BeautifulSoup(html, "html.parser")
    items = []
    current_location = "UCLA Dining"

    # Words to ignore when searching for actual dining hall names
    ignore_keywords = ["BREAKFAST", "LUNCH", "DINNER", "MENU FOR TODAY", "TODAY", "AUGUST", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY", "SUNDAY"]

    for element in soup.find_all(['h2', 'h3', 'h4', 'a']):
        
        # 1. Update location header if element is a section heading
        if element.name in ['h2', 'h3', 'h4']:
            header_text = element.text.strip()
            
            # Check if header is NOT a date/meal banner
            is_generic_banner = any(keyword in header_text.upper() for keyword in ignore_keywords)
            
            if header_text and not is_generic_banner:
                # Clean up newlines or extra spaces in hall names
                current_location = re.sub(r'\s+', ' ', header_text)

        # 2. Grab item details when encountering a recipe link
        elif element.name == 'a' and element.has_attr('href'):
            href = element['href']
            if "/menu-item/" in href or "recipe=" in href:
                name = element.text.strip()
                full_url = href if href.startswith("http") else f"{BASE_URL}{href}"
                
                if name and not any(item["url"] == full_url for item in items):
                    items.append({
                        "name": name,
                        "location": current_location,
                        "url": full_url
                    })

    return items

