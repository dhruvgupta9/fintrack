const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt');

// ─── SIGNUP ───────────────────────────────────────────────
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const existingUser = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  if (existingUser) {
    return res.status(400).json({ message: 'Email already exists' });
  }

  // ✅ Hash password before saving
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = db
    .prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)')
    .run(name, email, hashedPassword);

  res.json({
    message: 'Signup successful',
    user: {
      id: result.lastInsertRowid,
      name,
      email
    }
  });
});

// ─── LOGIN ────────────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  // ✅ Fetch by email only, then compare hashed password
  const user = db
    .prepare('SELECT * FROM users WHERE email = ?')
    .get(email);

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: 'Invalid email or password' });
  }

  res.json({
    message: 'Login successful',
    user: {
      id: user.id,
      name: user.name,
      email: user.email
    }
  });
});

// ─── CHANGE PASSWORD ──────────────────────────────────────
router.put('/change-password', async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;

  if (!userId || !currentPassword || !newPassword) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // ✅ better-sqlite3 is synchronous — use prepare().get()
    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedNew = await bcrypt.hash(newPassword, 10);

    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedNew, userId);

    res.json({ message: 'Password changed successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;