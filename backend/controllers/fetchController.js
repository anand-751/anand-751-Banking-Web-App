import db from '../db.js'; // Database connection

// Fetch user details by email
export const getUserDetails = (req, res) => {
    const { email } = req.user; // Extract email from the authenticated user token (middleware)

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    console.log('Authenticated user:', req.user); // Debugging line to verify req.user

    db.get('SELECT email, accountNumber FROM users WHERE email = ?', [email], (err, row) => {
        if (err) {
            console.error('Error fetching user details:', err.message);
            console.error('Query failed:', `SELECT name, accountNumber FROM users WHERE email = ${email}`);
            return res.status(500).json({ error: 'Database error', details: err.message });
        }

        if (!row) {
            return res.status(404).json({ error: 'User not found' });
        }

        return res.status(200).json(row); // Return name and accountNumber
    });
};
