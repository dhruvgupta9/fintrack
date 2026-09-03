import { useState } from 'react'

function Login({ onLogin, goToSignup }) {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setMsg(data.message)
        return
      }

      onLogin(data.user)
    } catch (error) {
      setMsg('Cannot connect to server. Make sure the backend is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">💰 FinTrack</div>
        <h2>Welcome back</h2>
        <p className="auth-subtitle">Sign in to your account</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              name="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        {msg && <p className="auth-message error">{msg}</p>}

        <p className="auth-switch">
          Don&apos;t have an account?{' '}
          <button type="button" className="auth-link-btn" onClick={goToSignup}>
            Sign up
          </button>
        </p>
      </div>
    </div>
  )
}

// ✅ FIXED: was `export default login` (lowercase), which caused a crash
export default Login