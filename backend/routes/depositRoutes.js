import express from 'express';
import { deposit } from '../controllers/transactionController.js';
import verifyToken from '../middleware/authenticateToken.js';

const router = express.Router();

// Define the POST route for deposits
router.post('/', verifyToken, deposit);

export default router;
