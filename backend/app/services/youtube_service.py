import os
from googleapiclient.discovery import build
from dotenv import load_dotenv

# Load your secret keys from the .env vault
load_dotenv()

# Securely grab your YouTube API key
api_key = os.getenv("YOUTUBE_API_KEY")

def fetch_learning_videos(query: str, max_results: int = 3):
    try:
        # Build the connection to YouTube
        youtube = build('youtube', 'v3', developerKey=api_key)
        
        # Ask YouTube to search for videos matching our query
        request = youtube.search().list(
            part="snippet",
            q=query,
            type="video",
            maxResults=max_results
        )
        response = request.execute()
        
        # Format the messy YouTube data into a clean, easy-to-read list
        videos = []
        for item in response.get("items", []):
            videos.append({
                "title": item["snippet"]["title"],
                "description": item["snippet"]["description"],
                "video_id": item["id"]["videoId"],
                "url": f"https://www.youtube.com/watch?v={item['id']['videoId']}"
            })
            
        return videos
    except Exception as e:
        return f"Error connecting to YouTube: {str(e)}"