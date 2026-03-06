import os
import requests
from dotenv import load_dotenv

# Load your secret keys
load_dotenv()
api_key = os.getenv("NEWS_API_KEY")

def fetch_market_news(query: str):
    # We ask the News API for the 3 most recent articles matching the user's career domain
    url = f"https://newsapi.org/v2/everything?q={query}&sortBy=publishedAt&pageSize=3&apiKey={api_key}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        # Clean up the data into a simple list
        articles = []
        for item in data.get("articles", []):
            articles.append({
                "title": item.get("title"),
                "description": item.get("description"),
                "url": item.get("url"),
                "source": item.get("source", {}).get("name")
            })
            
        return articles
    except Exception as e:
        return f"Error connecting to News API: {str(e)}"