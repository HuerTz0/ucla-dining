import json
import os

def save_data(data, filename = "menu_data.json"):
    output_path = os.path.join(os.path.dirname(__file__), filename)
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data,f,indent=2)
    print(f"Data saved to {output_path}")   
