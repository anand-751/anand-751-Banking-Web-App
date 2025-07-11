import db from '../db.js'; // Import database connection

const getBalance = (req, res) => {
    const { accountNumber } = req.query;

    // Debugging log to confirm the incoming request
    console.log("Query parameters received:", req.query);

    if (!accountNumber) {
        return res.status(400).json({ error: 'Account number is required' });
    }

    db.get('SELECT balance FROM balance_record WHERE accountNumber = ?', [accountNumber], (err, row) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
        if (!row) {
            console.warn("No record found for accountNumber:", accountNumber);
            return res.status(404).json({ error: 'Balance record not found' });
        }

        console.log("Retrieved balance:", row.balance);
        return res.status(200).json({ balance: row.balance });
    });
};




const updateBalance = (accountNumber, amount, operation, callback) => {
    // Step 1: Check if the account exists in the 'users' table
    const sqlCheckUser = 'SELECT accountNumber FROM users WHERE accountNumber = ?';

    db.get(sqlCheckUser, [accountNumber], (err, row) => {
        if (err) {
            console.error(`Error checking account ${accountNumber} in users table:`, err);
            return callback(err);
        }

        if (!row) {
            console.log(`[DEBUG] Account ${accountNumber} does not exist in users table.`);
            return callback(new Error('Account does not exist.'));
        }

        console.log(`[DEBUG] Account ${accountNumber} found in users table.`);

        // Step 2: Check if the account exists in the 'balance_record' table
        const sqlCheckBalance = 'SELECT balance FROM balance_record WHERE accountNumber = ?';

        db.get(sqlCheckBalance, [accountNumber], (err, balanceRow) => {
            if (err) {
                console.error(`Error checking balance for account ${accountNumber}:`, err);
                return callback(err);
            }

            if (!balanceRow) {
                console.log(`[DEBUG] Account ${accountNumber} does not exist in balance_record table. Creating a new entry.`);

                // Insert new entry into balance_record with balance 0
                const sqlInsertBalance = 'INSERT INTO balance_record (accountNumber, balance) VALUES (?, ?)';
                db.run(sqlInsertBalance, [accountNumber, 0], (err) => {
                    if (err) {
                        console.error(`Error inserting new balance record for account ${accountNumber}:`, err);
                        return callback(err);
                    }
                    console.info(`New balance record created for account ${accountNumber}.`);
                    // Retry the operation after creating the record
                    updateBalance(accountNumber, amount, operation, callback);
                });
            } else {
                console.log(`[DEBUG] Account ${accountNumber} found in balance_record with balance: ${balanceRow.balance}`);

                // Step 3: Perform the deposit or withdrawal operation
                let query, values;
                if (operation === 'deposit') {
                    query = 'UPDATE balance_record SET balance = balance + ? WHERE accountNumber = ?';
                    values = [amount, accountNumber];
                } else if (operation === 'withdraw') {
                    if (balanceRow.balance < amount) {
                        return callback(new Error('Insufficient balance'));
                    }
                    query = 'UPDATE balance_record SET balance = balance - ? WHERE accountNumber = ?';
                    values = [amount, accountNumber];
                } else {
                    return callback(new Error('Invalid operation'));
                }

                // Execute the update
                db.run(query, values, (err) => {
                    if (err) {
                        console.error(`Error updating balance for account ${accountNumber}:`, err);
                        return callback(err);
                    }

                    // Fetch updated balance
                    db.get(sqlCheckBalance, [accountNumber], (err, updatedRow) => {
                        if (err || !updatedRow) {
                            console.error(`Error fetching updated balance for ${accountNumber}:`, err);
                            return callback(err || new Error('Account not found'));
                        }
                        console.info(`Balance updated for account ${accountNumber}: ${updatedRow.balance}`);
                        console.log(`[DEBUG] Final database state for ${accountNumber}:`, updatedRow);
                        return callback(null, { success: true, newBalance: updatedRow.balance });
                    });
                });
            }
        });
    });
};

  
  
const deposit = (req, res) => {
    const { amount } = req.body;
    const accountNumber = req.accountNumber; // Get account number from the token

    if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Deposit amount must be positive' });
    }

    // Retrieve the current balance of the account
    db.get('SELECT * FROM balance_record WHERE accountNumber = ?', [accountNumber], (err, row) => {
        if (err) {
            console.error('Error fetching balance:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }

        if (!row) {
            return res.status(404).json({ success: false, message: 'Account not found' });
        }

        // Calculate the new balance
        const newBalance = row.balance + amount;

        // Update the balance record in the database
        db.run('UPDATE balance_record SET balance = ? WHERE accountNumber = ?', [newBalance, accountNumber], (err) => {
            if (err) {
                console.error('Error updating balance:', err.message);
                return res.status(500).json({ success: false, message: 'Failed to update balance' });
            }

            return res.status(200).json({
                success: true,
                message: `Successfully deposited ${amount} to account ${accountNumber}`,
                newBalance: newBalance
            });
        });
    });
};

  


// Transfer Controller
const transfer = (req, res) => {
    const { senderAccount, receiverAccount, amount } = req.body;

    console.log('Request Body:', req.body);

    console.log('Sender:', senderAccount);
    console.log('Recipient:', receiverAccount);
    console.log('Amount:', amount);


    // Validate input
    if (
        !senderAccount ||
        !receiverAccount ||
        senderAccount === receiverAccount ||
        amount <= 0
    ) {
        return res.status(400).json({ error: 'Invalid transfer details' });
    }

    // Check if both sender and recipient accounts exist
    db.get('SELECT * FROM balance_record WHERE accountNumber = ?', [senderAccount], (err, sender) => {
        if (err) {
            return res.status(500).json({ error: 'Error retrieving sender account' });
        }
        if (!sender) {
            return res.status(404).json({ error: 'Sender account not found' });
        }

        db.get('SELECT * FROM balance_record WHERE accountNumber = ?', [receiverAccount], (err, recipient) => {
            if (err) {
                return res.status(500).json({ error: 'Error retrieving recipient account' });
            }
            if (!recipient) {
                return res.status(404).json({ error: 'Recipient account not found' });
            }

            // Check if sender has enough balance
            if (sender.balance < amount) {
                return res.status(400).json({ error: 'Insufficient balance in sender account' });
            }

            // Perform transaction in a single transaction block
            db.serialize(() => {
                // Deduct the amount from the sender's account
                updateBalance(senderAccount, amount, 'withdraw', (err) => {
                    if (err) {
                        return res.status(500).json({ error: 'Failed to deduct amount from sender' });
                    }

                    // Add the amount to the recipient's account
                    updateBalance(receiverAccount, amount, 'deposit', (err) => {
                        if (err) {
                            // Rollback sender's balance if recipient update fails
                            updateBalance(senderAccount, amount, 'deposit', () => { });
                            return res.status(500).json({ error: 'Failed to credit amount to recipient' });
                        }

                        // Successfully completed transfer
                        return res.status(200).json({
                            message: 'Transfer successful',
                            senderAccount,
                            receiverAccount,
                            amount,
                        });
                    });
                });
            });
        });
    });
};

export { deposit, transfer, getBalance };
