import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load secrets from .env
load_dotenv()

# Securely grab the Gemini key and configure the AI
api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# We are using Gemini 1.5 Flash
model = genai.GenerativeModel('gemini-2.5-flash')

# Notice we changed the parameter from 'resume_text' to 'prompt'
def analyze_resume_with_ai(prompt: str):
    try:
        # We removed the hardcoded instructions here! 
        # Now it will pass your beautiful, detailed prompt exactly as you wrote it.
        response = model.generate_content(prompt)
        
        return response.text
    except Exception as e:
        return f"Error connecting to AI: {str(e)}"