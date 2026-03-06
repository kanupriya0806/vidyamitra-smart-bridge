from fastapi import APIRouter

# This creates a mini-router for this specific file
router = APIRouter()

# We will add real AI features here later! For now, just a test endpoint.
@router.get("/")
def test_endpoint():
    return {"message": "This router is successfully connected!"}