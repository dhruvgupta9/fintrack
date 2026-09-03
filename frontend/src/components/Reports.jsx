import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from 'recharts'

const COLORS = ['#3b82f6', '#f43f5e', '#4ade80', '#f59e0b', '#a78bfa', '#fb7185']

const CATEGORY_COLORS = {
  'Food & Dining': '#f59e0b',
  'Rent & Housing': '#3b82f6',
  'Transport': '#06b6d4',
  'Entertainment': '#ec4899',
  'Health': '#4ade80',
  'Others': '#a78bfa',
  'Income': '#4ade80',
}

export default function Reports({ transactions }) {
  // Monthly income vs expense bar chart data
  const monthlyMap = {}
  transactions.forEach(t => {
    const month = t.date?.slice(0, 7) // "2026-04"
    if (!month) return
    if (!monthlyMap[month]) monthlyMap[month] = { month, income: 0, expense: 0 }
    if (t.type === 'income') monthlyMap[month].income += t.amount
    else monthlyMap[month].expense += t.amount
  })
  const monthlyData = Object.values(monthlyMap).sort((a, b) => a.month.localeCompare(b.month)).slice(-6)

  // Category pie chart data
  const catMap = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const cat = t.category || 'Others'
    catMap[cat] = (catMap[cat] || 0) + t.amount
  })
  const pieData = Object.entries(catMap).map(([name, value]) => ({ name, value }))

  // Daily spending line chart
  const dailyMap = {}
  transactions.filter(t => t.type === 'expense').forEach(t => {
    const day = t.date?.slice(0, 10)
    if (!day) return
    dailyMap[day] = (dailyMap[day] || 0) + t.amount
  })
  const lineData = Object.entries(dailyMap)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-14)
    .map(([date, amount]) => ({ date: date.slice(5), amount }))

  const tooltipStyle = {
    backgroundColor: '#1e2d45',
    border: '1px solid #334155',
    borderRadius: '8px',
    color: '#fff',
    fontSize: '13px'
  }

  return (
    <section className="panel">
      <h2 style={{ marginBottom: '24px' }}>Reports & Analytics</h2>

      {transactions.length === 0 ? (
        <p className="muted" style={{ textAlign: 'center', padding: '40px' }}>
          Add transactions to see your reports
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Income vs Expense Bar Chart */}
          <div>
            <h3 style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Monthly Income vs Expenses
            </h3>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={monthlyData} barGap={4}>
                <XAxis dataKey="month" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                <Tooltip contentStyle={tooltipStyle} />
                <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
                <Bar dataKey="income" fill="#4ade80" radius={[4, 4, 0, 0]} name="Income" />
                <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} name="Expense" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Daily Spending Line Chart */}
          {lineData.length > 1 && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Daily Spending Trend (Last 14 Days)
              </h3>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={lineData}>
                  <XAxis dataKey="date" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip contentStyle={tooltipStyle} />
                  <Line
                    type="monotone" dataKey="amount" stroke="#3b82f6"
                    strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }}
                    activeDot={{ r: 6, fill: '#60a5fa' }} name="Spent (₹)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Pie Chart */}
          {pieData.length > 0 && (
            <div>
              <h3 style={{ marginBottom: '16px', color: '#94a3b8', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Spending by Category
              </h3>
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie
                    data={pieData} cx="50%" cy="50%"
                    innerRadius={60} outerRadius={100}
                    dataKey="value" nameKey="name"
                    paddingAngle={3}
                  >
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={CATEGORY_COLORS[entry.name] || COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={tooltipStyle} formatter={(v) => `₹${v.toLocaleString()}`} />
                  <Legend wrapperStyle={{ color: '#94a3b8', fontSize: '13px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

        </div>
      )}
    </section>
  )
}