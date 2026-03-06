import Interview from './pages/Interview'
import Progress from './pages/Progress'
import Resume from './pages/Resume'
import Jobs from './pages/Jobs'
import Plan from './pages/Plan'
import Quiz from './pages/Quiz'
import Market from './pages/Market'
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'

export default function App() {
  // This state remembers if the user is logged in
  const [user, setUser] = useState(null)

  return (
    <Router>
      <div style={{ minHeight: '100vh', backgroundColor: '#F9FAFB' }}>
        <Routes>
          {/* If the user goes to the root URL, send them to dashboard if logged in, otherwise login */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          
          {/* The Login Route */}
          <Route path="/login" element={
            user ? <Navigate to="/dashboard" /> : <Login onLogin={(userData) => setUser(userData)} />
          } />
          
          {/* The Dashboard Route (Protected!) */}
          <Route path="/dashboard" element={
            user ? <Dashboard user={user} /> : <Navigate to="/login" />
          } />
          <Route path="/resume" element={user ? <Resume /> : <Navigate to="/login" />} />
          <Route path="/jobs" element={user ? <Jobs /> : <Navigate to="/login" />} />
          <Route path="/plan" element={user ? <Plan /> : <Navigate to="/login" />} />
          <Route path="/quiz" element={user ? <Quiz /> : <Navigate to="/login" />} />
          <Route path="/evaluate" element={user ? <Interview /> : <Navigate to="/login" />} />
          <Route path="/progress" element={user ? <Progress /> : <Navigate to="/login" />} />
          <Route path="/market" element={user ? <Market /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  )
}