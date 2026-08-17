from bs4 import BeautifulSoup
from config import BASE_URL

def parse_main_menu(html):
    if not html:
        return[]
    soup = BeautifulSoup(html, "html.parser")
    items = []

    
    