import io
import PyPDF2
from fastapi import APIRouter, UploadFile, File
from pydantic import BaseModel
from app.services.ai_service import analyze_resume_with_ai

router = APIRouter()

# Original endpoint for raw text
class ResumeRequest(BaseModel):
    resume_text: str

@router.post("/analyze")
def analyze_text(request: ResumeRequest):
    feedback = analyze_resume_with_ai(f"Review this: {request.resume_text}")
    return {"status": "success", "ai_evaluation": feedback}

# Upgraded endpoint for actual PDF files!
@router.post("/parse")
async def parse_resume_file(file: UploadFile = File(...)):
    try:
        # 1. Read the uploaded file into memory
        file_content = await file.read()
        
        # 2. Trick PyPDF2 into treating the memory data like a physical file
        pdf_file = io.BytesIO(file_content)
        
        # 3. Read the PDF and extract the text page by page
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        extracted_text = ""
        for page in pdf_reader.pages:
            extracted_text += page.extract_text() + "\n"
            
        # 4. If the PDF was empty or unreadable, let the user know
        if not extracted_text.strip():
            return {"status": "error", "message": "Could not extract text from this PDF. It might be an image."}

        # 5. Feed the actual resume text to your AI Engine
        # 5. Feed the actual resume text to your AI Engine
        prompt = f"""You are an expert technical recruiter and AI career coach. 
        Perform a comprehensive review of this resume and provide: 
        1) An Overall Score (out of 100)
        2) Key Strengths 
        3) Areas for Improvement 
        4) ATS Optimization Tips. 
        Format your response clearly with clean spacing and bullet points. 
        
        Resume Text:
        {extracted_text}"""
        feedback = analyze_resume_with_ai(prompt)
        
        return {
            "status": "success",
            "filename": file.filename,
            "ai_evaluation": feedback
        }
        
    except Exception as e:
        return {"status": "error", "message": f"An error occurred while reading the PDF: {str(e)}"}