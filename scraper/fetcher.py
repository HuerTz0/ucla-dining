import requests
from config import HEADERS

def get_html(url):
    try:
        response = requests.get(url, headers=HEADERS, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestsException as e:
        print(f"[Error] Failed to fetur {url}: {e}")
        return None
