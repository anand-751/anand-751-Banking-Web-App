import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from the Authorization header

    if (!token) {
        return res.status(403).json({ success: false, message: 'Token is required' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ success: false, message: 'Invalid token' });
        }

        // Store the decoded accountNumber into the request object
        req.accountNumber = decoded.accountNumber;
        next(); // Proceed to the next middleware or route handler
    });
};

export default verifyToken;
