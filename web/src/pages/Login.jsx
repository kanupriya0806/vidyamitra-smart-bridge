import { useState } from 'react'
import { Link } from 'react-router-dom'
import { User, Lock, Eye, EyeOff } from 'lucide-react'

export default function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('http://127.0.0.1:8000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        onLogin(data.user);
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Cannot connect to server.');
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh', 
      backgroundColor: '#F9FAFB',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ 
        width: '100%', 
        maxWidth: '420px', 
        padding: '40px', 
        backgroundColor: 'white', 
        borderRadius: '16px', 
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        boxSizing: 'border-box'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ margin: '0 0 10px 0', fontSize: '2rem', color: '#1F2937' }}>Welcome Back</h2>
          <p style={{ margin: 0, color: '#6B7280' }}>Sign in to continue to VidyaMitra</p>
        </div>

        {error && (
          <div style={{ padding: '12px', backgroundColor: '#FEE2E2', color: '#DC2626', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '0.9rem', fontWeight: '500' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Username</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '12px 14px', transition: 'border-color 0.2s' }}>
              <User size={18} color="#6B7280" />
              <input
                type="text"
                placeholder="Enter your username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '12px', fontSize: '1rem', color: '#1F2937' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#374151', fontSize: '0.9rem', fontWeight: '600' }}>Password</label>
            <div style={{ display: 'flex', alignItems: 'center', backgroundColor: '#F9FAFB', border: '1px solid #D1D5DB', borderRadius: '8px', padding: '12px 14px' }}>
              <Lock size={18} color="#6B7280" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                style={{ flex: 1, border: 'none', backgroundColor: 'transparent', outline: 'none', marginLeft: '12px', fontSize: '1rem', color: '#1F2937' }}
                required
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }}>
                {showPassword ? <EyeOff size={18} color="#6B7280" /> : <Eye size={18} color="#6B7280" />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} style={{ 
            width: '100%', 
            padding: '14px', 
            backgroundColor: '#4F46E5', 
            color: 'white', 
            border: 'none', 
            borderRadius: '8px', 
            fontSize: '1rem', 
            fontWeight: '600', 
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
          }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        
        <p style={{ marginTop: '24px', textAlign: 'center', color: '#6B7280', fontSize: '0.95rem' }}>
          Don't have an account? <Link to="/register" style={{ color: '#4F46E5', textDecoration: 'none', fontWeight: '600', marginLeft: '5px' }}>Register here</Link>
        </p>
      </div>
    </div>
  )
}