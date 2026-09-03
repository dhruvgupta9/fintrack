import { useState } from 'react'

const CATEGORIES = [
  { name: 'Food & Dining', color: '#f59e0b', icon: '🍔' },
  { name: 'Rent & Housing', color: '#3b82f6', icon: '🏠' },
  { name: 'Transport', color: '#06b6d4', icon: '🚗' },
  { name: 'Entertainment', color: '#ec4899', icon: '🎬' },
  { name: 'Health', color: '#4ade80', icon: '💊' },
  { name: 'Others', color: '#a78bfa', icon: '📦' },
]

export default function Budget({ transactions }) {
  const [budgets, setBudgets] = useState({
    'Food & Dining': 10000,
    'Rent & Housing': 15000,
    'Transport': 5000,
    'Entertainment': 3000,
    'Health': 3000,
    'Others': 2000,
  })
  const [editing, setEditing] = useState(null)
  const [editVal, setEditVal] = useState('')

  // Calculate actual spending per category from transactions
  const spending = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const cat = t.category || 'Others'
    spending[cat] = (spending[cat] || 0) + t.amount
  })

  const totalBudget = Object.values(budgets).reduce((s, v) => s + v, 0)
  const totalSpent = Object.values(spending).reduce((s, v) => s + v, 0)
  const totalPct = totalBudget ? Math.min((totalSpent / totalBudget) * 100, 100) : 0

  const saveEdit = (cat) => {
    const val = parseFloat(editVal)
    if (!isNaN(val) && val >= 0) setBudgets(prev => ({ ...prev, [cat]: val }))
    setEditing(null)
  }

  return (
    <section className="panel">
      <h2 style={{ marginBottom: '8px' }}>Monthly Budget</h2>
      <p className="muted" style={{ marginBottom: '24px' }}>Click any budget amount to edit it</p>

      {/* Overall budget ring */}
      <div style={{
        background: '#0f1623', borderRadius: '12px', padding: '20px',
        marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '20px'
      }}>
        <div style={{ position: 'relative', width: '100px', height: '100px', flexShrink: 0 }}>
          <svg width="100" height="100" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="none" stroke="#1e2d45" strokeWidth="12" />
            <circle
              cx="50" cy="50" r="40" fill="none"
              stroke={totalPct > 90 ? '#f43f5e' : totalPct > 70 ? '#f59e0b' : '#4ade80'}
              strokeWidth="12"
              strokeDasharray={`${totalPct * 2.51} 251`}
              strokeLinecap="round"
              transform="rotate(-90 50 50)"
              style={{ transition: 'stroke-dasharray 0.6s ease' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', fontSize: '14px', fontWeight: 'bold'
          }}>
            {Math.round(totalPct)}%
          </div>
        </div>
        <div>
          <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '6px' }}>Overall Budget Used</div>
          <div style={{ fontSize: '22px', fontWeight: 'bold', color: totalPct > 90 ? '#f43f5e' : '#fff' }}>
            ₹{totalSpent.toLocaleString()}
          </div>
          <div style={{ fontSize: '13px', color: '#64748b' }}>of ₹{totalBudget.toLocaleString()}</div>
          <div style={{ fontSize: '13px', color: '#4ade80', marginTop: '4px' }}>
            ₹{Math.max(totalBudget - totalSpent, 0).toLocaleString()} remaining
          </div>
        </div>
      </div>

      {/* Per-category budget bars */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {CATEGORIES.map(({ name, color, icon }) => {
          const budget = budgets[name] || 0
          const spent = spending[name] || 0
          const pct = budget ? Math.min((spent / budget) * 100, 100) : 0
          const over = spent > budget

          return (
            <div key={name} style={{ background: '#0f1623', borderRadius: '10px', padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px' }}>{icon}</span>
                  <span style={{ fontWeight: '500' }}>{name}</span>
                  {over && (
                    <span style={{
                      background: 'rgba(244,63,94,0.2)', color: '#f43f5e',
                      fontSize: '11px', padding: '2px 6px', borderRadius: '8px'
                    }}>Over budget!</span>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: over ? '#f43f5e' : '#fff', fontWeight: '600' }}>
                    ₹{spent.toLocaleString()}
                  </span>
                  <span style={{ color: '#475569', fontSize: '13px' }}> / </span>
                  {editing === name ? (
                    <input
                      type="number"
                      value={editVal}
                      onChange={e => setEditVal(e.target.value)}
                      onBlur={() => saveEdit(name)}
                      onKeyDown={e => e.key === 'Enter' && saveEdit(name)}
                      autoFocus
                      style={{
                        width: '80px', background: '#1e2d45', border: '1px solid #3b82f6',
                        borderRadius: '4px', color: '#fff', padding: '2px 6px', fontSize: '13px'
                      }}
                    />
                  ) : (
                    <span
                      style={{ color: '#64748b', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline dotted' }}
                      onClick={() => { setEditing(name); setEditVal(budget) }}
                      title="Click to edit budget"
                    >
                      ₹{budget.toLocaleString()}
                    </span>
                  )}
                </div>
              </div>

              {/* Progress bar */}
              <div style={{ height: '8px', background: '#1e2d45', borderRadius: '8px', overflow: 'hidden' }}>
                <div style={{
                  height: '100%',
                  width: `${pct}%`,
                  background: over ? '#f43f5e' : pct > 70 ? '#f59e0b' : color,
                  borderRadius: '8px',
                  transition: 'width 0.5s ease'
                }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '12px', color: '#475569' }}>
                <span>{Math.round(pct)}% used</span>
                <span>₹{Math.max(budget - spent, 0).toLocaleString()} left</span>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}