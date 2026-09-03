const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || '*'
}));
app.use(express.json());

app.use('/api/transactions', transactionsRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});