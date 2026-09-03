import { useState } from 'react'

function Signup({ goToLogin }) {
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [msgType, setMsgType] = useState('error')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setMsg('')
    setLoading(true)

    try {
      const res = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })

      const data = await res.json()

      if (!res.ok) {
        setMsgType('error')
        setMsg(data.message)
        return
      }

      setMsgType('success')
      setMsg('Account created! Redirecting to login...')
      setTimeout(() => {
        goToLogin()
      }, 1200)
    } catch (error) {
      setMsgType('error')
      setMsg('Cannot connect to server. Make sure the backend is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-logo">💰 FinTrack</div>
        <h2>Create account</h2>
        <p className="auth-subtitle">Start tracking your finances</p>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="John Doe"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

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
              placeholder="Create a password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {msg && <p className={`auth-message ${msgType}`}>{msg}</p>}

        <p className="auth-switch">
          Already have an account?{' '}
          <button type="button" className="auth-link-btn" onClick={goToLogin}>
            Login
          </button>
        </p>
      </div>
    </div>
  )
}

export default Signup