import json
from fastapi import APIRouter
from pydantic import BaseModel
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter()

# 1. Added num_questions to the request model
class QuizRequest(BaseModel):
    domain: str
    difficulty: str
    num_questions: int 

@router.post("/generate")
def generate_quiz(request: QuizRequest):
    # Safety check to keep it between 5 and 15
    num_q = max(5, min(15, request.num_questions))
    
    prompt = f"""You are an expert examiner. You MUST generate EXACTLY {num_q} multiple-choice questions about {request.domain} at a {request.difficulty} difficulty level. 
    Do not generate 3 questions. You must generate exactly {num_q} questions.
    
    Return ONLY a valid JSON array of {num_q} objects. Do not include any markdown formatting, backticks, or extra text.
    Each object must have exactly these keys:
    - "id": an integer
    - "text": the question string
    - "options": an array of 4 string choices
    - "correctAnswer": the exact string of the correct option
    """
    
    response_text = analyze_resume_with_ai(prompt)
    
    try:
        cleaned_text = response_text.replace("```json", "").replace("```", "").strip()
        questions = json.loads(cleaned_text)
        return {"status": "success", "questions": questions}
    except Exception as e:
        return {"status": "error", "message": "Failed to generate questions. Please try again."}