# VidyaMitra: AI-Powered Career Analytics Dashboard

VidyaMitra is a comprehensive, full-stack career preparation platform. It leverages generative AI and real-time market data to help candidates optimize their resumes, practice technical interviews, and track their learning progress across various tech domains.

## 🚀 Key Features

* **AI Resume Evaluation:** Upload a resume for instant ATS optimization, scoring, and targeted feedback using Google Gemini.
* **Interactive Mock Interviews:** A voice-enabled AI hiring manager that conducts dynamic, role-specific technical interviews and provides real-time verbal feedback.
* **Dynamic Skill Quizzes:** Generates custom, on-the-fly multiple-choice assessments for any technical domain and difficulty level.
* **Personalized Training Planner:** Curates top-rated YouTube video courses based on identified skill gaps and target roles.
* **Live Market Insights:** Aggregates real-time global industry news, dynamically fetches domain-relevant stock photography, and calculates live USD-to-INR salary conversions.
* **Real-Time Progress Tracking:** A gamified analytics dashboard that monitors quiz scores, completed interviews, and overall career readiness.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* React Router (Navigation)
* Lucide React (Iconography)
* React Markdown (Rich text rendering)
* Web Speech API (Native voice recognition)

**Backend:**
* Python / FastAPI
* Uvicorn (ASGI server)

**External APIs & AI:**
* Google Gemini Pro (Core AI engine for resumes, quizzes, and interviews)
* YouTube Data API (Course curation)
* NewsAPI (Live industry headlines)
* ExchangeRate-API (Live salary conversion)
* Pexels API (Dynamic UI imagery)

## ⚙️ Local Setup Instructions

This project requires both the Python backend and the React frontend to be running simultaneously.

### 1. Backend Setup
Navigate to the `backend` directory and set up your virtual environment:

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows use: venv\Scripts\activate
pip install -r requirements.txt

Create a .env file in the backend directory and add your API keys:

GEMINI_API_KEY=your_gemini_key_here
PEXELS_API_KEY=your_pexels_key_here
NEWS_API_KEY=your_news_key_here
EXCHANGE_API_KEY=your_exchange_key_here

Start the FastAPI server:
uvicorn main:app --reload


2. Frontend Setup
Open a new terminal window, navigate to the web directory, and install the dependencies:
cd web
npm install

Start the Vite development server:
npm run dev

The frontend will be running at http://localhost:5173.

