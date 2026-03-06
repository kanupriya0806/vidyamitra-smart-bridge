import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mic, MicOff, MessageSquare, PlayCircle, Award, Loader, Send } from 'lucide-react'

export default function Interview() {
  const navigate = useNavigate()
  const [phase, setPhase] = useState('selection') 
  const [isListening, setIsListening] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputText, setInputText] = useState('')
  const [isAiThinking, setIsAiThinking] = useState(false)
  
  // NEW: State to track when the interview is over so we can show the Finish button
  const [isInterviewOver, setIsInterviewOver] = useState(false)
  
  const messagesEndRef = useRef(null)
  
  const stateRef = useRef({
    jobRole: localStorage.getItem('selectedJobRole') || 'Software Engineer',
    questionCount: 0
  })

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isAiThinking, isInterviewOver])

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
  const recognition = SpeechRecognition ? new SpeechRecognition() : null
  
  if (recognition) {
    recognition.continuous = false
    recognition.interimResults = false
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript
      setInputText(transcript)
      setIsListening(false)
    }
    recognition.onerror = () => setIsListening(false)
    recognition.onend = () => setIsListening(false)
  }

  const toggleRecording = () => {
    if (!recognition) {
      alert("Your browser does not support voice recognition. Please use the text box!")
      return
    }
    if (isListening) {
      recognition.stop()
      setIsListening(false)
    } else {
      recognition.start()
      setIsListening(true)
    }
  }

  const startInterview = async () => {
    setPhase('in-progress')
    const initialMessage = { role: 'user', text: "I am ready to begin the interview." }
    await sendMessageToAI([initialMessage], false)
  }

  const handleSend = async () => {
    if (!inputText.trim()) return
    
    const newUserMsg = { role: 'user', text: inputText }
    const updatedMessages = [...messages, newUserMsg]
    
    setMessages(updatedMessages)
    setInputText('')
    stateRef.current.questionCount += 1
    
    // Pass true to the backend if this is the 3rd and final answer!
    const isFinalRound = stateRef.current.questionCount >= 3
    await sendMessageToAI(updatedMessages, isFinalRound)
  }

  // Notice we now accept isFinal as a parameter
  const sendMessageToAI = async (currentHistory, isFinal) => {
    setIsAiThinking(true)
    try {
      const response = await fetch('http://127.0.0.1:8000/interview/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          job_role: stateRef.current.jobRole, 
          history: currentHistory,
          is_final: isFinal // Send the flag to the backend
        })
      })
      
      const data = await response.json()
      if (response.ok && data.reply) {
        setMessages(prev => [...prev, { role: 'ai', text: data.reply }])
        // If it was the final round, show the Finish button after AI replies!
        if (isFinal) {
          setIsInterviewOver(true)
        }
      } else {
        setMessages(prev => [...prev, { role: 'ai', text: "I'm having trouble connecting to my servers. Let's try that again." }])
      }
    } catch (err) {
      console.error(err)
      setMessages(prev => [...prev, { role: 'ai', text: "Connection error. Please check your backend server." }])
    } finally {
      setIsAiThinking(false)
    }
  }

  const finishInterview = () => {
    // Save to the progress tracker only when they officially click finish
    localStorage.setItem('interviewsCompleted', parseInt(localStorage.getItem('interviewsCompleted') || '0') + 1)
    setPhase('completed')
  }

  // --- RENDER 1: SETUP PHASE ---
  if (phase === 'selection') {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
        <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <MessageSquare color="#059669" /> AI Mock Interview
        </h2>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <PlayCircle size={60} color="#059669" style={{ margin: '0 auto 20px' }} />
          <h3 style={{ fontSize: '1.5rem', color: '#1F2937', marginBottom: '10px' }}>Ready to practice?</h3>
          <p style={{ color: '#6B7280', marginBottom: '30px' }}>Your target role is set to: <strong>{stateRef.current.jobRole}</strong></p>
          <button onClick={startInterview} style={{ padding: '14px 30px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer' }}>
            Start Interview
          </button>
        </div>
      </div>
    )
  }

  // --- RENDER 2: COMPLETED PHASE ---
  if (phase === 'completed') {
    return (
      <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <div style={{ backgroundColor: 'white', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <Award size={60} color="#059669" style={{ margin: '0 auto 20px' }} />
          <h2 style={{ color: '#1F2937', marginBottom: '10px' }}>Interview Complete!</h2>
          <p style={{ color: '#6B7280', marginBottom: '30px' }}>Excellent work. Your completed mock interview has been saved to your progress tracker.</p>
          <button onClick={() => navigate('/dashboard')} style={{ padding: '12px 24px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  // --- RENDER 3: IN-PROGRESS (CHAT) PHASE ---
  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '600px' }}>
        
        {/* Chat Window */}
        <div style={{ flex: 1, padding: '20px', overflowY: 'auto', backgroundColor: '#F9FAFB', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {messages.map((msg, idx) => {
            if (idx === 0 && msg.role === 'user') return null; 
            
            return (
              <div key={idx} style={{ alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%', padding: '15px', borderRadius: '12px', backgroundColor: msg.role === 'user' ? '#059669' : 'white', color: msg.role === 'user' ? 'white' : '#1F2937', border: msg.role === 'ai' ? '1px solid #E5E7EB' : 'none', lineHeight: '1.5' }}>
                {msg.text}
              </div>
            )
          })}
          {isAiThinking && (
             <div style={{ alignSelf: 'flex-start', padding: '15px', borderRadius: '12px', backgroundColor: 'white', border: '1px solid #E5E7EB', display: 'flex', gap: '10px', alignItems: 'center' }}>
               <Loader className="animate-spin" size={16} color="#059669" /> Interviewer is typing...
             </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div style={{ padding: '20px', borderTop: '1px solid #E5E7EB', backgroundColor: 'white', display: 'flex', gap: '10px' }}>
          
          {isInterviewOver ? (
            <button 
              onClick={finishInterview}
              style={{ width: '100%', padding: '15px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Finish & Save Results
            </button>
          ) : (
            <>
              <button 
                onClick={toggleRecording}
                title="Click to speak"
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px', height: '50px', backgroundColor: isListening ? '#FEE2E2' : '#F3F4F6', color: isListening ? '#DC2626' : '#4B5563', border: `1px solid ${isListening ? '#FCA5A5' : '#D1D5DB'}`, borderRadius: '50%', cursor: 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
              >
                {isListening ? <MicOff size={24} /> : <Mic size={24} />}
              </button>

              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder={isListening ? "Listening..." : "Type your answer or use the microphone..."}
                style={{ flex: 1, padding: '0 15px', border: '1px solid #D1D5DB', borderRadius: '25px', fontSize: '1rem', outline: 'none' }}
              />

              <button 
                onClick={handleSend}
                disabled={!inputText.trim() || isAiThinking}
                style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '50px', height: '50px', backgroundColor: (!inputText.trim() || isAiThinking) ? '#D1D5DB' : '#059669', color: 'white', border: 'none', borderRadius: '50%', cursor: (!inputText.trim() || isAiThinking) ? 'not-allowed' : 'pointer', transition: 'all 0.2s', flexShrink: 0 }}
              >
                <Send size={20} style={{ marginLeft: '3px' }}/>
              </button>
            </>
          )}

        </div>
      </div>
    </div>
  )
}