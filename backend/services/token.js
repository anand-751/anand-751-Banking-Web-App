// services/tokens.js

import jwt from 'jsonwebtoken';

// Function to generate access and refresh tokens
const generateTokens = (user) => {
    const accessToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, accountNumber: user.accountNumber },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );

    const refreshToken = jwt.sign(
        { id: user.id, email: user.email, role: user.role, accountNumber: user.accountNumber },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: '7d' }
    );

    return { accessToken, refreshToken };
};

export { generateTokens };
