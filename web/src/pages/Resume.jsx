import ReactMarkdown from 'react-markdown'
import { useState } from 'react'
import { FileText, Upload, AlertCircle, CheckCircle } from 'lucide-react'

export default function Resume() {
  // Converted from your screenshot to pure JS
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setResult(null)

    if (!file) {
      setError('Please select a file')
      return
    }

    const form = new FormData()
    form.append('file', file, file.name)
    setLoading(true)

    try {
      // Swapped 'api.post' for standard fetch to match our setup
      const res = await fetch('http://127.0.0.1:8000/resume/parse', {
        method: 'POST',
        body: form
      })
      const data = await res.json()
      
      if (res.ok) {
        setResult(data)
        // Save the result so the Plan page can use it later!
        localStorage.setItem('resumeAnalysis', JSON.stringify(data)) 
      } else {
        setError(data.detail || 'Failed to parse resume')
      }
    } catch (err) {
      setError(err.message || 'Failed to parse')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ fontSize: '2rem', color: '#1F2937', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <FileText color="#4F46E5" /> Resume Evaluation
      </h2>
      <p style={{ color: '#6B7280', marginBottom: '30px' }}>Upload your resume to identify skill gaps and areas for improvement.</p>

      <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        {error && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '15px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px' }}>
            <AlertCircle size={20} /> {error}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div style={{ border: '2px dashed #D1D5DB', borderRadius: '8px', padding: '40px', textAlign: 'center', marginBottom: '20px', backgroundColor: '#F9FAFB' }}>
            <Upload size={40} color="#9CA3AF" style={{ margin: '0 auto 15px' }} />
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: 'block', margin: '0 auto', color: '#4B5563' }}
            />
          </div>

          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', backgroundColor: '#4F46E5', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.05rem', fontWeight: '600', cursor: loading ? 'not-allowed' : 'pointer' }}>
            {loading ? 'Analyzing...' : 'Analyze Resume'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '40px', padding: '30px', backgroundColor: '#F8FAFC', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.05)' }}>
            <h3 style={{ color: '#0F172A', display: 'flex', alignItems: 'center', gap: '10px', margin: '0 0 20px 0', fontSize: '1.5rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '15px' }}>
              <CheckCircle size={28} color="#10B981" /> 
              Analysis for {result.filename}
            </h3>
            
            {/* We use whiteSpace: 'pre-wrap' so React respects Gemini's paragraph breaks and bullet points! */}
            <div style={{ color: '#334155', fontSize: '1.05rem', lineHeight: '1.7', fontFamily: 'system-ui, -apple-system, sans-serif', padding: '0 10px' }}>
              <ReactMarkdown>{result.ai_evaluation}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}