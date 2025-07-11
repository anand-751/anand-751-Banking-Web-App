import express from 'express';
import { getBalance } from '../controllers/transactionController.js';

const router = express.Router();

// Removed authenticateToken middleware
router.get('/', getBalance);

export default router;
