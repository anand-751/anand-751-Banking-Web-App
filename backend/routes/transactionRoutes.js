import express from 'express';
import { transfer } from '../controllers/transactionController.js';

const router = express.Router();

// Routes
router.post('/', transfer);

export default router;
