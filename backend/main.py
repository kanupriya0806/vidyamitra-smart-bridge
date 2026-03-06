from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import all of our modular routers from the app/routers folder
from app.routers import resume, evaluate, plan, quiz, interview, jobs, progress, market

app = FastAPI(title="Vidyamitra API", version="0.1.0")

# Setup CORS so the React frontend can talk to us
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Connect all the separate feature files to the main app!
app.include_router(resume.router, prefix="/resume", tags=["resume"])
app.include_router(evaluate.router, prefix="/evaluate", tags=["evaluate"])
app.include_router(plan.router, prefix="/plan", tags=["plan"])
app.include_router(quiz.router, prefix="/quiz", tags=["quiz"])
app.include_router(interview.router, prefix="/interview", tags=["interview"])
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(progress.router, prefix="/progress", tags=["progress"])
app.include_router(market.router, prefix="/market", tags=["market"])

# --- ROOT ENDPOINT ---
@app.get(path="/")
def root() -> dict[str, str]:
    return {"name": "Vidyamitra API", "status": "ok"}

# --- LOGIN ENDPOINT (From Activity 2.1) ---
class LoginRequest(BaseModel):
    username: str
    password: str

@app.post("/login", tags=["auth"])
def login(request: LoginRequest):
    if request.username == "admin" and request.password == "password123":
        return {
            "message": "Login successful", 
            "user": {"username": "admin", "firstName": "Admin", "lastName": "User"}
        }
    raise HTTPException(status_code=400, detail="Invalid username or password")