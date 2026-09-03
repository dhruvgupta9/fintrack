const Database = require('better-sqlite3');
const db = new Database('fintrack.db');

// Create table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    description TEXT NOT NULL,
    category TEXT NOT NULL,
    date TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('income', 'expense')),
    amount REAL NOT NULL,
    userId INTEGER
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL
  )
`);

// Add userId column to existing DB if it doesn't exist
try {
  db.exec('ALTER TABLE transactions ADD COLUMN userId INTEGER');
  console.log('Added userId column to transactions');
} catch (e) {
  // Column already exists, ignore
}

module.exports = db;