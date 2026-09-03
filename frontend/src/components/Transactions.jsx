import { useState } from 'react'

export default function Transactions({ transactions, onDelete }) {
  const [filter, setFilter] = useState('All')
  const filtered = transactions.filter(t =>
    filter === 'All' ? true : t.type === filter.toLowerCase()
  )

  return (
    <section className="panel">
      <div className="panel-head">
        <h2>Transactions</h2>
        <select value={filter} onChange={e => setFilter(e.target.value)}
          style={{ padding: '6px', borderRadius: '5px', border: 'none', background: '#1e2d45', color: 'white' }}>
          <option>All</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>
      <table>
        <thead>
          <tr>
            <th>Description</th><th>Category</th><th>Date</th><th>Type</th><th>Amount</th><th></th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(t => (
            <tr key={t.id}>
              <td>{t.description}</td>
              <td>{t.category}</td>
              <td>{t.date}</td>
              <td>
                <span className={`badge ${t.type === 'income' ? 'green-bg' : 'red-bg'}`}>
                  {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                </span>
              </td>
              <td className={t.type === 'income' ? 'green' : 'red'}>
                {t.type === 'income' ? '+' : '-'}₹{t.amount.toLocaleString()}
              </td>
              <td><button className="del-btn" onClick={() => onDelete(t.id)}>✕</button></td>
            </tr>
          ))}
          {filtered.length === 0 && (
            <tr><td colSpan="6" style={{ color: '#aaa', textAlign: 'center', padding: '20px' }}>No transactions</td></tr>
          )}
        </tbody>
      </table>
    </section>
  )
}