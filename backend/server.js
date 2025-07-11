import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv'; // Ensure dotenv is loaded first
import authRoutes from './routes/authRoutes.js';
import transferRoutes from './routes/transactionRoutes.js';
import depositRoutes from './routes/depositRoutes.js';
import balanceRoutes from './routes/balanceRoutes.js';
import { ensureUsersTable, ensureBalanceTable } from './db.js';

dotenv.config();  // Load environment variables before any other logic
console.log(process.env.JWT_SECRET)

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Ensure tables are created/ensured when the server starts
ensureUsersTable();
ensureBalanceTable();

// Authentication routes
app.use('/api/auth', authRoutes)

// Transfer routes
app.use('/api/transfer', transferRoutes);

// Deposit routes
app.use('/api/deposit', depositRoutes);

app.use('/api/balance', balanceRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
