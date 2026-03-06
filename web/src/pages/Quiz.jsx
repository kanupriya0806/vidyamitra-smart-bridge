import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckSquare, AlertCircle, ChevronRight, CheckCircle, Loader, XCircle, Settings } from 'lucide-react'

export default function Quiz() {
  const navigate = useNavigate()
  const [domain, setDomain] = useState('Data Science')
  const [difficulty, setDifficulty] = useState('Medium')
  const [numQuestions, setNumQuestions] = useState(5) // New state for question count
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  
  const [questions, setQuestions] = useState([])
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)

  const handleStartQuiz = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('http://127.0.0.1:8000/quiz/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Pass the new numQuestions variable to your backend
        body: JSON.stringify({ domain, difficulty, num_questions: numQuestions })
      })

      if (!response.ok) throw new Error(`Server status: ${response.status}`)
      
      const data = await response.json()

      if (data.questions) {
        setQuestions(data.questions)
      } else {
        setError(data.message || "The AI didn't return valid questions.")
      }
    } catch (err) {
      console.error("🚨 QUIZ FETCH ERROR:", err)
      setError(`Connection Error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  // Instantly lock in the answer
  const handleAnswer = (option) => {
    // Only allow selecting if they haven't answered this question yet
    if (!answers[currentQuestion]) {
      setAnswers({ ...answers, [currentQuestion]: option })
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      let finalScore = 0
      questions.forEach((q, index) => {
        if (answers[index] === q.correctAnswer) {
          finalScore += 1
        }
      })
      setScore(finalScore)
      setSubmitted(true)
      localStorage.setItem('lastQuizScore', `${finalScore}/${questions.length}`)
      localStorage.setItem('quizzesTaken', parseInt(localStorage.getItem('quizzesTaken') || '0') + 1)
    }
  }

  // --- RENDER 1: SETUP PHASE ---
  if (questions.length === 0) {
    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Settings color="#DC2626" /> Setup AI Quiz
        </h2>
        
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          {error && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px' }}>
              <AlertCircle size={20} /> {error}
            </div>
          )}

          <form onSubmit={handleStartQuiz}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>Topic Domain</label>
              <input type="text" value={domain} onChange={(e) => setDomain(e.target.value)} placeholder="e.g., Python, React, Data Science" style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginBottom: '25px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>Difficulty</label>
                <select value={difficulty} onChange={(e) => setDifficulty(e.target.value)} style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box', backgroundColor: 'white' }}>
                  <option>Easy</option>
                  <option>Medium</option>
                  <option>Hard</option>
                </select>
              </div>

              <div style={{ flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600' }}>Question Count</label>
                <input 
                  type="number" 
                  min="5" 
                  max="15" 
                  value={numQuestions} 
                  onChange={(e) => setNumQuestions(Number(e.target.value))} 
                  style={{ width: '100%', padding: '12px', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '1rem', boxSizing: 'border-box' }} 
                />
              </div>
            </div>

            <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', justifyContent: 'center', gap: '10px' }}>
              {loading ? <><Loader className="animate-spin" size={20} /> Generating via AI...</> : 'Start Quiz'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  // --- RENDER 2: RESULTS PHASE ---
  if (submitted) {
    const percentage = Math.round((score / questions.length) * 100)
    const passed = percentage >= 60

    return (
      <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
         <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
            {passed ? <CheckCircle size={70} color="#10B981" style={{ margin: '0 auto 20px' }} /> : <XCircle size={70} color="#DC2626" style={{ margin: '0 auto 20px' }} />}
            <h2 style={{ color: '#1F2937', marginBottom: '10px', fontSize: '2.5rem' }}>{percentage}%</h2>
            <h3 style={{ color: '#374151', marginBottom: '10px' }}>You scored {score} out of {questions.length}</h3>
            <button onClick={() => navigate('/dashboard')} style={{ marginTop: '20px', padding: '14px 28px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer' }}>Back to Dashboard</button>
         </div>
      </div>
    )
  }

  // --- RENDER 3: ACTIVE QUIZ PHASE ---
  const currentQ = questions[currentQuestion]
  const isAnswered = !!answers[currentQuestion]
  const selectedAnswer = answers[currentQuestion]

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>
          Question {currentQuestion + 1} of {questions.length} • {domain}
        </p>
        <h3 style={{ fontSize: '1.3rem', color: '#1F2937', marginTop: '0', marginBottom: '24px', lineHeight: '1.5' }}>{currentQ.text}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '30px' }}>
          {currentQ.options.map((opt, idx) => {
            // Determine dynamic colors for immediate feedback
            let bg = '#F9FAFB'
            let border = '1px solid #E5E7EB'
            let text = '#374151'
            let cursor = isAnswered ? 'default' : 'pointer'

            if (isAnswered) {
              if (opt === currentQ.correctAnswer) {
                // The right answer turns green!
                bg = '#D1FAE5'
                border = '2px solid #10B981'
                text = '#065F46'
              } else if (opt === selectedAnswer) {
                // The wrong answer you clicked turns red!
                bg = '#FEE2E2'
                border = '2px solid #EF4444'
                text = '#991B1B'
              } else {
                // Other options fade out slightly
                text = '#9CA3AF'
              }
            }

            return (
              <div 
                key={idx} 
                onClick={() => handleAnswer(opt)}
                style={{ 
                  padding: '16px', 
                  backgroundColor: bg,
                  border: border,
                  color: text,
                  borderRadius: '8px', 
                  cursor: cursor, 
                  transition: 'all 0.2s',
                  fontWeight: (isAnswered && (opt === currentQ.correctAnswer || opt === selectedAnswer)) ? '600' : 'normal'
                }}
              >
                {opt}
              </div>
            )
          })}
        </div>

        <button 
          onClick={handleNext} 
          disabled={!isAnswered}
          style={{ width: '100%', padding: '14px', backgroundColor: isAnswered ? '#1F2937' : '#D1D5DB', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: isAnswered ? 'pointer' : 'not-allowed', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', transition: 'background-color 0.2s' }}
        >
          {currentQuestion === questions.length - 1 ? 'Finish & Grade Quiz' : 'Next Question'} <ChevronRight size={20} />
        </button>
      </div>
    </div>
  )
}