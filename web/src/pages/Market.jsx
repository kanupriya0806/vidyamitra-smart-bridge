import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Globe, Newspaper, DollarSign, ExternalLink, Loader, ArrowLeft } from 'lucide-react'

export default function Market() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const jobRole = localStorage.getItem('selectedJobRole') || 'Software Engineering'

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/market/insights', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ domain: jobRole })
        })
        const result = await response.json()
        if (response.ok) setData(result)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMarketData()
  }, [jobRole])

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '100px 0' }}>
        <Loader className="animate-spin" size={50} color="#2563EB" style={{ margin: '0 auto 20px' }} />
        <p style={{ color: '#6B7280', fontSize: '1.2rem' }}>Fetching live global market data...</p>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      
      {/* 1. The Pexels Dynamic Header Image */}
      <div style={{ height: '250px', backgroundImage: `url(${data?.image_url})`, backgroundSize: 'cover', backgroundPosition: 'center', borderRadius: '16px', position: 'relative', marginBottom: '30px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}>
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: '16px' }} />
        <div style={{ position: 'absolute', bottom: '30px', left: '30px', color: 'white' }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
            <Globe size={36} /> {jobRole} Market
          </h1>
          <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>Live industry insights, news, and salary expectations.</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '25px', marginBottom: '30px' }}>
        
        {/* 2. The Exchange Rate Salary Card */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: '4px solid #10B981' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#1F2937' }}>
            <DollarSign color="#10B981" /> Global Remote Salary
          </h3>
          <p style={{ color: '#6B7280', fontSize: '0.95rem', marginBottom: '20px' }}>Equivalent local value for a standard $100k USD US remote role based on live exchange rates.</p>
          <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#065F46', marginBottom: '5px' }}>
            ₹{data?.salary_inr_lakhs} Lakhs <span style={{ fontSize: '1rem', color: '#6B7280', fontWeight: 'normal' }}>/ year</span>
          </div>
        </div>

        {/* 3. The News API Live Feed */}
        <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)', borderTop: '4px solid #3B82F6' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: 0, color: '#1F2937', marginBottom: '20px' }}>
            <Newspaper color="#3B82F6" /> Live Industry News
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            {data?.news?.map((article, idx) => (
              <a key={idx} href={article.url} target="_blank" rel="noreferrer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', textDecoration: 'none', color: '#1F2937', padding: '12px', backgroundColor: '#F3F4F6', borderRadius: '8px', transition: 'all 0.2s' }}>
                <div style={{ paddingRight: '15px' }}>
                  <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem', fontWeight: '600', lineHeight: '1.4' }}>{article.title}</p>
                  <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>{article.source}</span>
                </div>
                <ExternalLink size={16} color="#3B82F6" style={{ flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>

      </div>

      <button onClick={() => navigate('/dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 24px', backgroundColor: '#1F2937', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1rem', fontWeight: '600', cursor: 'pointer' }}>
        <ArrowLeft size={20} /> Back to Dashboard
      </button>

    </div>
  )
}