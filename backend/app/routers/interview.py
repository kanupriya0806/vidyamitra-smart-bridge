from fastapi import APIRouter
from pydantic import BaseModel
from typing import List
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter()

class Message(BaseModel):
    role: str
    text: str

class InterviewRequest(BaseModel):
    job_role: str
    history: List[Message]
    is_final: bool = False  # <-- NEW: Tells the AI if it's the last round!

@router.post("/chat")
def conduct_interview(request: InterviewRequest):
    conversation = ""
    for msg in request.history:
        prefix = "Candidate" if msg.role == "user" else "Interviewer"
        conversation += f"{prefix}: {msg.text}\n"

    # Dynamic instructions based on whether it is the end of the interview
    if request.is_final:
        instructions = "The candidate just provided their FINAL answer. Give them 2-3 sentences of encouraging feedback on this last answer and conclude the interview. DO NOT ask any more questions."
    else:
        instructions = "1. If the candidate just answered a question, provide 1 brief sentence of feedback.\n2. Ask the NEXT technical interview question.\n3. Keep it under 4 sentences."

    prompt = f"""You are an expert technical interviewer hiring for a {request.job_role} position.
    Here is the interview transcript so far:
    
    {conversation}
    
    Instructions for your next response:
    {instructions}
    """
    
    try:
        response_text = analyze_resume_with_ai(prompt)
        return {"status": "success", "reply": response_text.strip()}
    except Exception as e:
        return {"status": "error", "message": "The interviewer is currently unavailable."}