import express from 'express';
import { signup, login } from '../controllers/authController.js';

const router = express.Router();

// POST /signup
router.post('/signup', signup);

// POST /login
router.post('/login', login);


export default router;
