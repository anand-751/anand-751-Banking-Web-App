import express from 'express';
import { sendPasswordResetLink, resetPassword } from '../controllers/userController.js';  // Make sure the path is correct

const router = express.Router();

router.post('/send-reset-link', sendPasswordResetLink); // Send reset link to email
router.post('/reset-password', resetPassword); // Reset password

export default router;
