import os
import requests
from fastapi import APIRouter
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()
router = APIRouter()

class MarketRequest(BaseModel):
    domain: str

@router.post("/insights")
def get_market_data(request: MarketRequest):
    try:
        # 1. Fetch Dynamic Image from Pexels
        pex_url = f"https://api.pexels.com/v1/search?query={request.domain} technology&per_page=1"
        pex_headers = {"Authorization": os.getenv("PEXELS_API_KEY")}
        pex_resp = requests.get(pex_url, headers=pex_headers).json()
        image_url = pex_resp.get("photos", [{}])[0].get("src", {}).get("landscape", "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg")

        # 2. Fetch Live Industry News
        news_url = f"https://newsapi.org/v2/everything?q={request.domain}&pageSize=3&sortBy=relevancy&apiKey={os.getenv('NEWS_API_KEY')}"
        news_resp = requests.get(news_url).json()
        articles = [{"title": a["title"], "url": a["url"], "source": a["source"]["name"]} for a in news_resp.get("articles", [])]

        # 3. Fetch Live Exchange Rate (USD to INR for remote salary estimates)
        base_salary_usd = 100000 # Example base salary
        ex_url = f"https://v6.exchangerate-api.com/v6/{os.getenv('EXCHANGE_API_KEY')}/latest/USD"
        ex_resp = requests.get(ex_url).json()
        inr_rate = ex_resp.get("conversion_rates", {}).get("INR", 83.0) # Fallback to 83.0 if API fails
        converted_salary = round((base_salary_usd * inr_rate) / 100000, 2) # Converted to Lakhs

        return {
            "status": "success",
            "image_url": image_url,
            "news": articles,
            "salary_usd": base_salary_usd,
            "salary_inr_lakhs": converted_salary
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}