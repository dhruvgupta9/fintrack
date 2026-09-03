//sqlite is db is used and stored in binary format 
//for backend express and node.js i used
const express = require('express');
const cors = require('cors');
const authRouter = require('./routes/auth');
const transactionsRouter = require('./routes/transactions');

const app = express();//created express server
app.use(cors());
app.use(express.json());

app.use('/api/transactions', transactionsRouter);
app.use('/api/auth', authRouter);

app.listen(5000, () => {
  console.log('Server running on port 5000');
});