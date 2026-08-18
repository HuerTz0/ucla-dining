from bs4 import BeautifulSoup
import re

def parse_item_nutrtion(html):
    if not html:
        return {"calories": 0, "protein": 0.0}

    soup = BeautifulSoup(html, "html.parser")
    nutrition_data = {"calories": 0, "protein": 0.0}

    # 1. Extract Calories
    calories_el = soup.find("p", class_="single-calories")
    if calories_el:
        cal_match = re.search(r"(\d+)", calories_el.get_text())
        if cal_match:
            nutrition_data["calories"] = int(cal_match.group(1))

    # 2. Extract Protein from <table class="nutritive-table">
    # Search for any span that contains the word "Protein"
    protein_span = soup.find(lambda tag: tag.name == "span" and "Protein" in tag.text)
    
    if protein_span:
        # Get the parent <td> or <tr> containing the text (e.g., "Protein 8.86g")
        parent_cell = protein_span.find_parent("td") or protein_span.find_parent("tr")
        if parent_cell:
            # Extract floating-point numbers (e.g., 8.86)
            protein_match = re.search(r"(\d+(?:\.\d+)?)", parent_cell.get_text().replace(protein_span.text, ""))
            if protein_match:
                nutrition_data["protein"] = float(protein_match.group(1))

    return nutrition_data