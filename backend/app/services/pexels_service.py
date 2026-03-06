import os
import requests
from dotenv import load_dotenv

# Load your secret keys from the .env vault
load_dotenv()

# Securely grab your Pexels API key
api_key = os.getenv("PEXELS_API_KEY")

def fetch_learning_visuals(query: str, per_page: int = 3):
    # Pexels requires the API key to be sent in the "headers" of the request
    url = f"https://api.pexels.com/v1/search?query={query}&per_page={per_page}"
    headers = {
        "Authorization": api_key
    }
    
    try:
        # Send the request to Pexels
        response = requests.get(url, headers=headers)
        data = response.json()
        
        # Clean up the messy data into a simple list of images
        visuals = []
        for photo in data.get("photos", []):
            visuals.append({
                "image_url": photo["src"]["medium"], # Grabs a good quality, web-friendly size
                "description": photo["alt"],
                "photographer": photo["photographer"]
            })
            
        return visuals
    except Exception as e:
        return f"Error connecting to Pexels: {str(e)}"