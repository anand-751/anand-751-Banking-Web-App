import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import db from '../db.js';
import { validateEmail, validatePassword } from '../services/validationService.js';

const signup = async (req, res) => {
    const { email, password, accountNumber } = req.body;
    let role = 'user';

    if (email && email.split('@')[0].includes('admin')) {
        role = 'admin';
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }
    if (!validatePassword(password)) {
        return res.status(400).json({ error: 'Password must be at least 6 characters and contain both letters and numbers' });
    }

    if (!accountNumber) {
        return res.status(400).json({ error: 'Account number is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const userExists = await new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });

    if (userExists) {
        return res.status(400).json({ error: 'Email is already in use' });
    }

    db.serialize(() => {
        db.run(
            'INSERT INTO users (email, password, role, accountNumber) VALUES (?, ?, ?, ?)',
            [email, hashedPassword, role, accountNumber],
            function (err) {
                if (err) {
                    console.error('Error inserting user:', err);
                    return res.status(500).json({ error: 'Failed to sign up user' });
                }

                db.run(
                    'INSERT INTO balance_record (accountNumber, balance) VALUES (?, ?)',
                    [accountNumber, 0],
                    function (err) {
                        if (err) {
                            console.error('Error inserting balance record:', err);
                            return res.status(500).json({ error: 'Failed to create balance record' });
                        }

                        return res.status(201).json({
                            message: 'User created successfully',
                            role,
                            accountNumber,
                        });
                    }
                );
            }
        );
    });
};


const login = (req, res) => {
    const { email, password } = req.body;

    if (!validateEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Retrieve user from database
    db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the password
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) {
                console.error('Error comparing passwords:', err.message);
                return res.status(500).json({ error: 'Internal server error' });
            }

            if (!isMatch) {
                return res.status(400).json({ error: 'Invalid password' });
            }

            // Generate JWT token
            const token = jwt.sign(
                {
                    email: user.email,
                    role: user.role,
                    accountNumber: user.accountNumber,
                },
                process.env.JWT_SECRET,
            );

            return res.status(200).json({
                message: 'Login successful',
                token: token,
                role: user.role,
                accountNumber: user.accountNumber,
            });
        });
    });
};

export { signup, login };
