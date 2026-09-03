const CATEGORIES = [
  { name: 'Food & Dining',  color: '#f59e0b', icon: '🍔' },
  { name: 'Rent & Housing', color: '#3b82f6', icon: '🏠' },
  { name: 'Transport',      color: '#06b6d4', icon: '🚗' },
  { name: 'Entertainment',  color: '#ec4899', icon: '🎬' },
  { name: 'Health',         color: '#4ade80', icon: '💊' },
  { name: 'Others',         color: '#a78bfa', icon: '📦' },
]

export default function Dashboard({ transactions }) {
  const expenses = transactions.filter(t => t.type === 'expense')
  const total = expenses.reduce((s, t) => s + t.amount, 0)
  const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)

  const categories = CATEGORIES.map(({ name, color, icon }) => {
    const amt = expenses.filter(t => t.category === name).reduce((s, t) => s + t.amount, 0)
    return { name, color, icon, amt, pct: total ? (amt / total) * 100 : 0 }
  })

  const topCategory = [...categories].sort((a, b) => b.amt - a.amt)[0]
  const savingsRate = income > 0 ? Math.round(((income - total) / income) * 100) : 0

  return (
    <div style={{ position: 'relative' }}>

      {/* ── BACKGROUND GRID ── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        backgroundImage: `
          linear-gradient(var(--grid-line) 1px, transparent 1px),
          linear-gradient(90deg, var(--grid-line) 1px, transparent 1px)
        `,
        backgroundSize: '48px 48px',
      }} />

      {/* ── GLOW ORBS ── */}
      <div style={{ position: 'fixed', top: '10%', right: '12%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-blue) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '20%', right: '5%',  width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-purple) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '50%', right: '25%',    width: 250, height: 250, borderRadius: '50%', background: 'radial-gradient(circle, var(--orb-pink) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1 }}>

        {/* ── QUICK STATS ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }}>
          {[
            {
              label: 'Savings Rate',
              value: income > 0 ? `${savingsRate}%` : '—',
              sub: 'of income saved',
              color: '#4ade80',
              bgVar: 'var(--stat-green-bg)',
              borderVar: 'var(--stat-green-border)',
              icon: '📈'
            },
            {
              label: 'Avg Transaction',
              value: expenses.length > 0 ? `₹${Math.round(total / expenses.length).toLocaleString()}` : '—',
              sub: `${expenses.length} expenses`,
              color: '#f59e0b',
              bgVar: 'var(--stat-amber-bg)',
              borderVar: 'var(--stat-amber-border)',
              icon: '🧾'
            },
            {
              label: 'Top Category',
              value: topCategory?.amt > 0 ? topCategory.icon + ' ' + topCategory.name.split(' ')[0] : '—',
              sub: topCategory?.amt > 0 ? `₹${topCategory.amt.toLocaleString()}` : 'No expenses yet',
              color: topCategory?.color || '#94a3b8',
              bgVar: 'var(--stat-gray-bg)',
              borderVar: 'var(--stat-gray-border)',
              icon: null
            },
          ].map(({ label, value, sub, color, bgVar, borderVar, icon }) => (
            <div key={label} style={{
              background: bgVar,
              border: `1px solid ${borderVar}`,
              borderRadius: '16px', padding: '20px',
              transition: 'transform 0.2s, box-shadow 0.2s',
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 8px 32px ${color}22` }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            >
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1.2px', marginBottom: '10px', fontWeight: 600 }}>
                {icon && <span style={{ marginRight: '5px' }}>{icon}</span>}{label}
              </div>
              <div style={{ fontSize: '22px', fontWeight: 800, color, marginBottom: '5px', letterSpacing: '-0.5px' }}>{value}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{sub}</div>
            </div>
          ))}
        </div>

        {/* ── SPENDING BY CATEGORY ── */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '18px', padding: '24px', marginBottom: '20px',
          boxShadow: 'var(--panel-shadow)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.3px' }}>Spending by Category</div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>Where your money goes</div>
            </div>
            <div style={{
              padding: '7px 14px', borderRadius: '20px',
              background: 'var(--badge-red-bg)', border: '1px solid var(--badge-red-border)',
              fontSize: '13px', fontWeight: 700, color: 'var(--red)',
            }}>
              ₹{total.toLocaleString()} total
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {categories.map(({ name, color, icon, amt, pct }) => (
              <div key={name} style={{
                display: 'grid', gridTemplateColumns: '42px 1fr 90px',
                alignItems: 'center', gap: '14px',
                padding: '13px 16px',
                background: 'var(--cat-row-bg)',
                borderRadius: '12px',
                border: `1px solid ${amt > 0 ? color + '30' : 'var(--cat-row-border)'}`,
                transition: 'all 0.25s',
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--cat-row-hover)';
                  e.currentTarget.style.borderColor = color + '55';
                  e.currentTarget.style.transform = 'translateX(4px)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'var(--cat-row-bg)';
                  e.currentTarget.style.borderColor = amt > 0 ? color + '30' : 'var(--cat-row-border)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                {/* Icon box */}
                <div style={{
                  width: 42, height: 42, borderRadius: '12px',
                  background: `linear-gradient(135deg, ${color}22, ${color}10)`,
                  border: `1px solid ${color}35`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '18px', flexShrink: 0,
                  boxShadow: amt > 0 ? `0 0 12px ${color}22` : 'none',
                }}>
                  {icon}
                </div>

                {/* Bar */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '7px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>{name}</span>
                    <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{pct.toFixed(0)}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'var(--bar-track)', borderRadius: '99px', overflow: 'hidden' }}>
                    <div style={{
                      height: '100%',
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${color}88, ${color})`,
                      borderRadius: '99px',
                      transition: 'width 1s cubic-bezier(0.4,0,0.2,1)',
                      boxShadow: amt > 0 ? `0 0 10px ${color}77` : 'none',
                    }} />
                  </div>
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right' }}>
                  <div style={{
                    fontSize: '15px', fontWeight: 700,
                    color: amt > 0 ? color : 'var(--text-muted)',
                    letterSpacing: '-0.3px',
                  }}>
                    ₹{amt.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RECENT ACTIVITY ── */}
        <div style={{
          background: 'var(--panel-bg)',
          border: '1px solid var(--panel-border)',
          borderRadius: '18px', padding: '24px',
          boxShadow: 'var(--panel-shadow)',
        }}>
          <div style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '5px', letterSpacing: '-0.3px' }}>Recent Activity</div>
          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '18px' }}>Your latest transactions</div>

          {transactions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px' }}>
              <div style={{ fontSize: '40px', marginBottom: '12px' }}>💳</div>
              <div style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: 600, marginBottom: '6px' }}>No transactions yet</div>
              <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Hit "+ Add Transaction" to begin tracking</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {transactions.slice(0, 5).map((t, i) => (
                <div key={t.id || i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '12px 16px',
                  background: 'var(--cat-row-bg)',
                  borderRadius: '12px',
                  border: '1px solid var(--cat-row-border)',
                  transition: 'all 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'var(--cat-row-hover)';
                    e.currentTarget.style.borderColor = 'var(--panel-border-hover)';
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'var(--cat-row-bg)';
                    e.currentTarget.style.borderColor = 'var(--cat-row-border)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{
                      width: 40, height: 40, borderRadius: '50%', flexShrink: 0,
                      background: t.type === 'income' ? 'rgba(74,222,128,0.12)' : 'rgba(251,113,133,0.12)',
                      border: `1px solid ${t.type === 'income' ? 'rgba(74,222,128,0.3)' : 'rgba(251,113,133,0.3)'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '16px', fontWeight: 700,
                      color: t.type === 'income' ? '#4ade80' : '#fb7185',
                    }}>
                      {t.type === 'income' ? '↑' : '↓'}
                    </div>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{t.description}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '3px' }}>
                        <span style={{
                          background: 'var(--tag-bg)',
                          color: 'var(--text-secondary)',
                          padding: '2px 8px',
                          borderRadius: '20px', marginRight: '6px', fontSize: '11px',
                        }}>{t.category}</span>
                        {t.date}
                      </div>
                    </div>
                  </div>
                  <div style={{
                    fontSize: '15px', fontWeight: 800,
                    color: t.type === 'income' ? '#4ade80' : '#fb7185',
                    letterSpacing: '-0.3px',
                  }}>
                    {t.type === 'income' ? '+' : '-'}₹{Number(t.amount).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}