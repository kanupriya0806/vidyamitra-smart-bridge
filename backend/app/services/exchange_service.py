import os
import requests
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("EXCHANGE_API_KEY")

def fetch_exchange_rates(base_currency: str = "USD"):
    # Connect to the ExchangeRate-API
    url = f"https://v6.exchangerate-api.com/v6/{api_key}/latest/{base_currency}"
    
    try:
        response = requests.get(url)
        data = response.json()
        
        if data.get("result") == "success":
            rates = data.get("conversion_rates", {})
            # Return a few major global currencies relevant to international job markets
            return {
                "USD": rates.get("USD"),
                "EUR": rates.get("EUR"),
                "GBP": rates.get("GBP"),
                "INR": rates.get("INR"),
                "JPY": rates.get("JPY")
            }
        return "Error fetching rates from API"
    except Exception as e:
        return f"Error connecting to Exchange API: {str(e)}"