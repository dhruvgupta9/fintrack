const express = require('express');
const router = express.Router();
const db = require('../db');

// GET transactions for a specific user only
router.get('/', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'userId is required' });

  const rows = db
    .prepare('SELECT * FROM transactions WHERE userId = ? ORDER BY date DESC')
    .all(userId);
  res.json(rows);
});

// POST add transaction with userId
router.post('/', (req, res) => {
  const { description, category, date, type, amount, userId } = req.body;

  if (!userId) return res.status(400).json({ message: 'userId is required' });

  const stmt = db.prepare(
    'INSERT INTO transactions (description, category, date, type, amount, userId) VALUES (?, ?, ?, ?, ?, ?)'
  );
  const result = stmt.run(description, category, date, type, amount, userId);
  res.json({ id: result.lastInsertRowid });
});

// DELETE transaction (only if it belongs to the user)
router.delete('/:id', (req, res) => {
  db.prepare('DELETE FROM transactions WHERE id = ?').run(req.params.id);
  res.json({ success: true });
});

module.exports = router;