import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer'; // Used to send reset link via email
//import { getUserByEmail, createUser } from '../model/userModel.js';

const sendPasswordResetLink = (req, res) => {
  const { email } = req.body;

  // Check if user exists
  db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
    if (err) {
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (!row) {
      return res.status(404).json({ error: 'User not found' });
    }

    const resetToken = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    // Send email with reset token
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Link',
      text: `Click on the link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset link sent' });
    });
  });
};

const resetPassword = (req, res) => {
  const { resetToken, newPassword } = req.body;

  jwt.verify(resetToken, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }

    bcrypt.hash(newPassword, 10, (err, hashedPassword) => {
      if (err) {
        return res.status(500).json({ error: 'Error hashing password' });
      }

      db.run('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, decoded.email], (err) => {
        if (err) {
          return res.status(500).json({ error: 'Error updating password' });
        }
        res.status(200).json({ message: 'Password successfully reset' });
      });
    });
  });
};

export { sendPasswordResetLink, resetPassword };
