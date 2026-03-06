from fastapi import APIRouter
from pydantic import BaseModel
from app.services.news_service import fetch_market_news
from app.services.exchange_service import fetch_exchange_rates

router = APIRouter()

class MarketRequest(BaseModel):
    domain: str

# Endpoint 1: Fetching industry news
@router.post("/market-news")
def get_market_news(request: MarketRequest):
    news = fetch_market_news(request.domain)
    return {
        "status": "success",
        "career_domain": request.domain,
        "recent_news": news
    }

# Endpoint 2: Fetching global exchange rates
@router.get("/exchange-rates")
def get_exchange_rates(base: str = "USD"):
    rates = fetch_exchange_rates(base)
    return {
        "status": "success",
        "base_currency": base,
        "rates": rates
    }