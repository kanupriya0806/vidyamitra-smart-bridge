import { Link } from 'react-router-dom'
import { FileText, Target, BookOpen, CheckSquare, Briefcase, TrendingUp, Globe } from 'lucide-react'

export default function Dashboard({ user }) {
  // A list of all our career modules to map into a grid
  const modules = [
    { title: 'Resume Evaluation', icon: <FileText size={32} />, path: '/resume', color: '#4F46E5' },
    { title: 'Skill Mapping', icon: <Target size={32} />, path: '/evaluate', color: '#059669' },
    { title: 'Training Planner', icon: <BookOpen size={32} />, path: '/plan', color: '#D97706' },
    { title: 'Quiz Performance', icon: <CheckSquare size={32} />, path: '/quiz', color: '#DC2626' },
    { title: 'Job Recommendations', icon: <Briefcase size={32} />, path: '/jobs', color: '#2563EB' },
    { title: 'Progress Tracking', icon: <TrendingUp size={32} />, path: '/progress', color: '#7C3AED' },
    { title: 'Market Insights', icon: <Globe size={32} />, path: '/market', color: '#0ea5e9' },
  ]

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '40px 20px', fontFamily: 'sans-serif' }}>
      <header style={{ marginBottom: '40px', textAlign: 'center' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1F2937', marginBottom: '10px' }}>
          Welcome back, {user?.firstName || 'Admin'}!
        </h1>
        <p style={{ color: '#6B7280', fontSize: '1.1rem' }}>
          Select a career module below to continue your learning journey.
        </p>
      </header>

      {/* Switched from Grid to Flexbox to perfectly center the 7th orphan card */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '24px' }}>
        {modules.map((mod, index) => (
          <Link to={mod.path} key={index} style={{ textDecoration: 'none', color: 'inherit', flex: '1 1 280px', maxWidth: '310px' }}>
            <div style={{ 
              border: '1px solid #E5E7EB', 
              borderRadius: '16px', 
              padding: '30px', 
              textAlign: 'center', 
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              backgroundColor: 'white',
              cursor: 'pointer',
              height: '100%',
              boxSizing: 'border-box'
            }}>
              <div style={{ color: mod.color, marginBottom: '20px', display: 'flex', justifyContent: 'center' }}>
                {mod.icon}
              </div>
              <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#374151' }}>{mod.title}</h3>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}