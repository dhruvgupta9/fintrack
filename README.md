# 💰 FinTrack

A full-stack personal finance tracker to manage income, expenses, budgets, and financial reports — with a clean dashboard and secure authentication.

🔗 **Live Demo:** [https://dhruvgupta9.github.io/fintrack](https://dhruvgupta9.github.io/fintrack)

## Features

- 🔐 User authentication (Signup/Login)
- 📊 Dashboard with balance, income, expenses, and savings overview
- 💸 Add, view, and delete transactions
- 📅 Budget tracking
- 📈 Visual reports with charts (Recharts)
- 🌗 Dark / Light theme toggle
- 💾 Persistent data storage with SQLite

## Tech Stack

**Frontend**
- React 19 (Vite)
- Recharts for data visualization
- Plain CSS for styling

**Backend**
- Node.js + Express
- SQLite for the database
- CORS-enabled REST API

**Deployment**
- Frontend: GitHub Pages
- Backend: Render

## Project Structure

```
fintrack/
├── backend/
│   ├── routes/
│   ├── db.js
│   ├── fintrack.db
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── App.jsx
    │   └── main.jsx
    └── vite.config.js
```

## Getting Started (Local Setup)

### Backend

```bash
cd backend
npm install
node server.js
```

Server runs on `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Create a `.env` file in `frontend/` with:

```
VITE_API_URL=http://localhost:5000
```

App runs on `http://localhost:5173`

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|--------------|
| POST | `/api/auth/signup` | Create a new user |
| POST | `/api/auth/login` | Log in a user |
| GET | `/api/transactions` | Get all transactions |
| POST | `/api/transactions` | Add a transaction |
| DELETE | `/api/transactions/:id` | Delete a transaction |

## License

This project is open source and available for personal or educational use.
