import json
import os

def save_data(data, filename="menu_data.json"):
    # Target frontend/public folder relative to this file's location
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    output_path = os.path.join(base_dir, "frontend", "public", filename)

    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    print(f"[Success] Saved {len(data)} items directly to {output_path}")
