import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Loader, Target, Youtube, ExternalLink, AlertCircle, ArrowRight, CheckCircle, Circle } from 'lucide-react'

export default function Plan() {
  const navigate = useNavigate()
  const [jobRole, setJobRole] = useState("General Tech Role")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [courses, setCourses] = useState([])
  
  // NEW: State to track which courses are completed
  const [completedCourses, setCompletedCourses] = useState([])

  useEffect(() => {
    const storedRole = localStorage.getItem('selectedJobRole') || "General Tech Role"
    setJobRole(storedRole)

    // Load saved progress for this specific role from local storage
    const savedProgress = localStorage.getItem(`progress_${storedRole}`)
    if (savedProgress) {
      setCompletedCourses(JSON.parse(savedProgress))
    }

    const fetchCourses = async () => {
      try {
        const query = `${storedRole} full course tutorial`

        const response = await fetch('http://127.0.0.1:8000/plan/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ skill_gap: query }) 
        })

        const data = await response.json()

        if (response.ok) {
          let videoList = []
          if (Array.isArray(data)) videoList = data
          else if (data.recommended_videos) videoList = data.recommended_videos
          else if (data.videos) videoList = data.videos
          else if (data.resources) videoList = data.resources
          else if (data.result) videoList = data.result
          else if (data.data) videoList = data.data

          setCourses(videoList)
        } else {
          setError(data.detail || "Failed to fetch courses from YouTube.")
        }
      } catch (err) {
        setError("Could not connect to the backend server.")
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])

  // NEW: Function to toggle a course's completion status
  const toggleCourse = (videoUrl) => {
    let updatedCompleted;
    if (completedCourses.includes(videoUrl)) {
      // Uncheck it
      updatedCompleted = completedCourses.filter(url => url !== videoUrl)
    } else {
      // Check it
      updatedCompleted = [...completedCourses, videoUrl]
    }
    
    setCompletedCourses(updatedCompleted)
    // Save to local storage so it remembers!
    localStorage.setItem(`progress_${jobRole}`, JSON.stringify(updatedCompleted))
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <BookOpen color="#D97706" /> Personalized Training Plan
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Your AI-curated video courses to master your target role.</p>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#6B7280' }}>
            <Loader className="animate-spin" size={40} color="#DC2626" style={{ margin: '0 auto 15px', animation: 'spin 1s linear infinite' }} />
            <p>Searching YouTube for the best {jobRole} courses...</p>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', padding: '15px', backgroundColor: '#FEF3C7', borderRadius: '8px', border: '1px solid #F59E0B' }}>
              <Target size={24} color="#D97706" />
              <h3 style={{ margin: 0, color: '#92400E' }}>Target Role: {jobRole}</h3>
            </div>
            
            <p style={{ color: '#374151', fontSize: '1.05rem', marginBottom: '25px', lineHeight: '1.6' }}>
              We have pulled the top-rated video courses directly from YouTube to help you prepare for a <strong>{jobRole}</strong> position. Mark them as complete as you finish them!
            </p>

            <h4 style={{ color: '#1F2937', borderBottom: '2px solid #E5E7EB', paddingBottom: '10px', marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Youtube color="#DC2626" /> Recommended Courses
            </h4>
            
            {courses.length === 0 && !error ? (
              <p style={{ color: '#6B7280', fontStyle: 'italic' }}>No courses found. Try searching for a different job role!</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '35px' }}>
                {courses.map((course, idx) => {
                  const videoUrl = course.url || course.link;
                  const isCompleted = completedCourses.includes(videoUrl);

                  return (
                    <div 
                      key={idx} 
                      style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        alignItems: 'center', 
                        padding: '16px', 
                        // The box turns green when checked!
                        border: isCompleted ? '1px solid #10B981' : '1px solid #E5E7EB', 
                        backgroundColor: isCompleted ? '#ECFDF5' : '#F9FAFB', 
                        borderRadius: '8px', 
                        transition: 'all 0.2s' 
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '15px', paddingRight: '15px', flex: 1 }}>
                        {/* The Checkbox Icon */}
                        <div onClick={() => toggleCourse(videoUrl)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', marginTop: '2px' }}>
                          {isCompleted ? <CheckCircle color="#10B981" size={24} /> : <Circle color="#9CA3AF" size={24} />}
                        </div>
                        
                        <span style={{ 
                          fontSize: '1.05rem', 
                          color: isCompleted ? '#065F46' : '#1F2937', 
                          fontWeight: '600', 
                          // Strikethrough effect when completed
                          textDecoration: isCompleted ? 'line-through' : 'none',
                          display: 'block' 
                        }}>
                          {course.title || course.video_title || "Video Course"}
                        </span>
                      </div>
                      
                      <a 
                        href={videoUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ flexShrink: 0, padding: '10px 16px', backgroundColor: isCompleted ? '#059669' : '#DC2626', color: 'white', textDecoration: 'none', borderRadius: '6px', fontSize: '0.9rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '6px', transition: 'background-color 0.2s' }}
                      >
                        Watch <ExternalLink size={16} />
                      </a>
                    </div>
                  )
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: '15px', borderTop: '2px solid #E5E7EB', paddingTop: '25px' }}>
              <button onClick={() => navigate('/quiz')} style={{ flex: 1, padding: '14px', backgroundColor: '#DC2626', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Take a Skill Quiz <ArrowRight size={18} />
              </button>
              <button onClick={() => navigate('/evaluate')} style={{ flex: 1, padding: '14px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: 'pointer', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                Practice Interview <ArrowRight size={18} />
              </button>
            </div>
            
            <button onClick={() => navigate('/dashboard')} style={{ width: '100%', marginTop: '15px', padding: '14px', backgroundColor: 'transparent', color: '#6B7280', border: '1px solid #D1D5DB', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  )
}