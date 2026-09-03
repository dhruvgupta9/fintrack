import { useState } from 'react'

export default function AddModal({ onAdd, onClose }) {
  const [form, setForm] = useState({
    description: '', category: 'Food & Dining',
    date: new Date().toISOString().split('T')[0],
    type: 'expense', amount: ''
  })

  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = () => {
    if (!form.description || !form.amount) return alert('Fill all fields')
    onAdd({ ...form, amount: parseFloat(form.amount) })
  }

  const overlay = {
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)',
    display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999
  }
  const box = {
    background: '#151d2e', padding: '24px', borderRadius: '12px',
    width: '360px', display: 'flex', flexDirection: 'column', gap: '12px'
  }
  const inp = {
    padding: '10px', borderRadius: '6px', border: '1px solid #333',
    background: '#0f1623', color: 'white', width: '100%'
  }

  return (
    <div style={overlay} onClick={onClose}>
      <div style={box} onClick={e => e.stopPropagation()}>
        <h2>Add Transaction</h2>
        <input style={inp} name="description" placeholder="Description" value={form.description} onChange={handle} />
        <select style={inp} name="category" value={form.category} onChange={handle}>
          {['Food & Dining','Rent & Housing','Transport','Entertainment','Health','Others','Income'].map(c =>
            <option key={c}>{c}</option>
          )}
        </select>
        <input style={inp} name="date" type="date" value={form.date} onChange={handle} />
        <select style={inp} name="type" value={form.type} onChange={handle}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input style={inp} name="amount" type="number" placeholder="Amount (₹)" value={form.amount} onChange={handle} />
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn-primary" style={{ flex: 1 }} onClick={submit}>Add</button>
          <button onClick={onClose} style={{ flex: 1, padding: '10px', borderRadius: '6px', background: '#1e2d45', border: 'none', color: 'white', cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}