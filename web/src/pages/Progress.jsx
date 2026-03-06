import { useState, useEffect } from 'react'
import { TrendingUp, BarChart2, CheckCircle, AlertCircle, Loader, Youtube } from 'lucide-react'

export default function Progress() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 1. Pull real data from the browser's memory
    const quizzes = parseInt(localStorage.getItem('quizzesTaken') || '0')
    const interviews = parseInt(localStorage.getItem('interviewsCompleted') || '0')
    
    // 2. Count up all the YouTube courses you checked off from the Plan page!
    let courses = 0
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key && key.startsWith('progress_')) {
        const savedCourses = JSON.parse(localStorage.getItem(key))
        courses += savedCourses.length
      }
    }

    // 3. Calculate a dynamic readiness score
    const baseScore = 15 // Start at 15% just for setting up the profile
    const calculatedScore = Math.min(100, baseScore + (quizzes * 5) + (interviews * 15) + (courses * 5))

    // Simulate a brief calculation delay for a premium feel
    setTimeout(() => {
      setData({
        overallScore: calculatedScore,
        quizzesTaken: quizzes,
        interviewsCompleted: interviews,
        coursesCompleted: courses
      })
      setLoading(false)
    }, 800)
  }, [])

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
        <TrendingUp color="#7C3AED" /> Your Real-Time Progress
      </h2>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 0', backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
          <Loader className="animate-spin" size={40} color="#7C3AED" style={{ margin: '0 auto 15px', animation: 'spin 1s linear infinite' }} />
          <p style={{ color: '#6B7280' }}>Crunching your latest analytics...</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '4px solid #7C3AED' }}>
            <BarChart2 size={30} color="#7C3AED" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#1F2937' }}>{data?.overallScore}%</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Overall Readiness</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '4px solid #DC2626' }}>
            <CheckCircle size={30} color="#DC2626" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#1F2937' }}>{data?.quizzesTaken}</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Quizzes Taken</p>
          </div>

          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '4px solid #059669' }}>
            <TrendingUp size={30} color="#059669" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#1F2937' }}>{data?.interviewsCompleted}</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Mock Interviews</p>
          </div>
          
          <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', textAlign: 'center', borderTop: '4px solid #D97706' }}>
            <Youtube size={30} color="#D97706" style={{ margin: '0 auto 10px' }} />
            <h3 style={{ fontSize: '2.5rem', margin: '0 0 5px 0', color: '#1F2937' }}>{data?.coursesCompleted}</h3>
            <p style={{ margin: 0, color: '#6B7280', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Courses Completed</p>
          </div>

        </div>
      )}
    </div>
  )
}