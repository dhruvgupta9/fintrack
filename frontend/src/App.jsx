import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Transactions from './components/Transactions'
import AddModal from './components/AddModal'
import Reports from './components/Reports'
import Budget from './components/Budget'
import Login from './components/Login'
import Signup from './components/Signup'
import './App.css'

const API = `${import.meta.env.VITE_API_URL}/api/transactions`

export default function App() {
  const [transactions, setTransactions] = useState([])
  const [page, setPage] = useState('dashboard')
  const [showModal, setShowModal] = useState(false)
  const [authPage, setAuthPage] = useState('login')
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user')
    return savedUser ? JSON.parse(savedUser) : null
  })

  // ── Theme ─ for dark and light mode 
  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'dark'
  )

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = () =>
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')

  // ── Data ───────────────────────────────────────────────
  useEffect(() => {
    if (!user) return
    fetch(`${API}?userId=${user.id}`)
      .then(r => r.json())
      .then(setTransactions)
      .catch(err => console.log(err))
  }, [user])

  const addTransaction = async (data) => {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, userId: user.id })
    })
    const { id } = await res.json()
    setTransactions(prev => [{ ...data, id }, ...prev])
    setShowModal(false)
  }

  const deleteTransaction = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setTransactions(prev => prev.filter(t => t.id !== id))
  }

  const handleLogin = (loggedInUser) => {
    localStorage.setItem('user', JSON.stringify(loggedInUser))
    setUser(loggedInUser)
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    setTransactions([])
    setPage('dashboard')
    setShowModal(false)
    setAuthPage('login')
  }

  const income   = transactions.filter(t => t.type === 'income') .reduce((s, t) => s + t.amount, 0)
  const expenses = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0)
  const balance  = income - expenses

  if (!user) {
    return authPage === 'login' ? (
      <Login onLogin={handleLogin} goToSignup={() => setAuthPage('signup')} />
    ) : (
      <Signup goToLogin={() => setAuthPage('login')} />
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar
        page={page}
        setPage={setPage}
        onLogout={handleLogout}
        user={user}
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="main">
        <header className="topbar">
          <div>
            <h1>{page.charAt(0).toUpperCase() + page.slice(1)}</h1>
            <small>{new Date().toLocaleString('default', { month: 'long', year: 'numeric' })}</small>
          </div>
          <button className="btn-primary" onClick={() => setShowModal(true)}>
            + Add Transaction
          </button>
        </header>

        <section className="cards">
          <div className="card">
            <p>Total Balance</p>
            <h2>₹{balance.toLocaleString()}</h2>
          </div>
          <div className="card">
            <p>Monthly Income</p>
            <h2 className="green">₹{income.toLocaleString()}</h2>
          </div>
          <div className="card">
            <p>Monthly Expenses</p>
            <h2 className="red">₹{expenses.toLocaleString()}</h2>
          </div>
          <div className="card">
            <p>Net Savings</p>
            <h2>₹{(income - expenses).toLocaleString()}</h2>
          </div>
        </section>

        {page === 'dashboard'    && <Dashboard    transactions={transactions} />}
        {page === 'transactions' && <Transactions transactions={transactions} onDelete={deleteTransaction} />}
        {page === 'budget'       && <Budget       transactions={transactions} />}
        {page === 'reports'      && <Reports      transactions={transactions} />}
      </main>

      {showModal && <AddModal onAdd={addTransaction} onClose={() => setShowModal(false)} />}
    </div>
  )
}