from fastapi import APIRouter
from pydantic import BaseModel
from app.services.youtube_service import fetch_learning_videos
from app.services.pexels_service import fetch_learning_visuals

router = APIRouter()

# --- Request Models ---
class ResourceRequest(BaseModel):
    skill_gap: str

class VisualRequest(BaseModel):
    topic: str

# --- Endpoints ---
@router.post("/resources")
def get_learning_resources(request: ResourceRequest):
    videos = fetch_learning_videos(request.skill_gap)
    return {
        "status": "success",
        "target_skill": request.skill_gap,
        "recommended_videos": videos
    }

# New endpoint for fetching dashboard visuals!
@router.post("/visuals")
def get_visual_resources(request: VisualRequest):
    images = fetch_learning_visuals(request.topic)
    return {
        "status": "success",
        "topic": request.topic,
        "visuals": images
    }