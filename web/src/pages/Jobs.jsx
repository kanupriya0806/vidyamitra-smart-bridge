import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Briefcase, Search, ChevronRight } from 'lucide-react'

export default function Jobs() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  
  // Expanded database of roles
  const [filteredRoles] = useState([
    { id: 1, title: 'Data Science Intern', domain: 'Data Science' },
    { id: 2, title: 'Machine Learning Engineer', domain: 'Data Science' },
    { id: 3, title: 'Python Backend Developer', domain: 'Software Engineering' },
    { id: 4, title: 'Data Analyst', domain: 'Data Science' },
    { id: 5, title: 'AI Research Scientist', domain: 'Artificial Intelligence' },
    { id: 6, title: 'Prompt Engineer', domain: 'Artificial Intelligence' },
    { id: 7, title: 'Frontend Web Developer', domain: 'Software Engineering' },
    { id: 8, title: 'Full Stack Developer', domain: 'Software Engineering' },
    { id: 9, title: 'DevOps Engineer', domain: 'Cloud & Infrastructure' },
    { id: 10, title: 'Cloud Architect (AWS/GCP)', domain: 'Cloud & Infrastructure' },
    { id: 11, title: 'Cybersecurity Analyst', domain: 'Security' },
    { id: 12, title: 'UI/UX Designer', domain: 'Design' },
    { id: 13, title: 'Product Manager', domain: 'Management' },
    { id: 14, title: 'Mobile App Developer', domain: 'Software Engineering' },
    { id: 15, title: 'Database Administrator', domain: 'Data Engineering' }
  ])

  const handleSelectRole = (role) => {
    localStorage.setItem('selectedJobRole', role.title)
    navigate('/plan')
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Briefcase color="#2563EB" /> Job Recommendations
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Select your target role to generate customized learning plans and interview prep.</p>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '12px 14px', marginBottom: '20px' }}>
          <Search size={20} color="#6B7280" />
          <input
            type="text"
            placeholder="Search roles (e.g., Data Science, Python, Design...)"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '12px', fontSize: '1rem', color: '#1F2937' }}
          />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '400px', overflowY: 'auto', paddingRight: '5px' }}>
          {filteredRoles.filter(r => r.title.toLowerCase().includes(searchTerm.toLowerCase()) || r.domain.toLowerCase().includes(searchTerm.toLowerCase())).map((role) => (
            <div 
              key={role.id}
              onClick={() => handleSelectRole(role)}
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', backgroundColor: '#F3F4F6', borderRadius: '8px', cursor: 'pointer', transition: 'background-color 0.2s' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#E5E7EB'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#F3F4F6'}
            >
              <div>
                <h4 style={{ margin: '0 0 5px 0', color: '#1F2937', fontSize: '1.1rem' }}>{role.title}</h4>
                <span style={{ fontSize: '0.85rem', color: '#6B7280', backgroundColor: '#E5E7EB', padding: '4px 8px', borderRadius: '4px' }}>{role.domain}</span>
              </div>
              <ChevronRight color="#9CA3AF" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}