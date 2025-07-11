import sqlite3 from 'sqlite3';
import path from 'path';

// Set up SQLite database connection
const dbPath = path.resolve('database.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error connecting to database:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});

// Function to ensure the 'users' table exists
export const ensureUsersTable = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'user',
            accountNumber TEXT NOT NULL
        )`,
        (err) => {
            if (err) {
                console.error('Error creating Users table:', err.message);
            } else {
                console.log('Users table ensured.');
            }
        }
    );
};

// Function to ensure the 'balance_record' table exists
export const ensureBalanceTable = () => {
    db.run(
        `CREATE TABLE IF NOT EXISTS balance_record (
            accountNumber TEXT NOT NULL UNIQUE,
            balance REAL DEFAULT 0
        )`,
        (err) => {
            if (err) {
                console.error('Error creating Balance Record table:', err.message);
            } else {
                console.log('Balance Record table ensured.');
            }
        }
    );
};

// Call the functions to ensure the tables exist


// Function to insert a user into the database
const insertUser = (email, hashedPassword, role = 'user', res) => {
    db.run(
        'INSERT INTO users (email, password, role) VALUES (?, ?, ?)',
        [email, hashedPassword, role],
        function (err) {
            if (err) {
                console.error('Error in INSERT query:', err.message);
                return res.status(500).json({ error: 'Database insert error' });
            }
            console.log('Insert successful with ID:', this.lastID);
            res.status(201).json({ message: 'User created', id: this.lastID });
        }
    );
};

// Named exports for helper functions
export function getUserByEmail(email) {
    return new Promise((resolve, reject) => {
        db.get('SELECT * FROM users WHERE email = ?', [email], (err, row) => {
            if (err) {
                return reject(err);
            }
            resolve(row);
        });
    });
}

export function createUser(user) {
    return new Promise((resolve, reject) => {
        const { email, password } = user;
        db.run('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], function (err) {
            if (err) {
                return reject(err);
            }
            resolve({ id: this.lastID, email, password });
        });
    });
}

// Default export for the Database instance
export default db;
