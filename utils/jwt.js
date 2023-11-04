const jwt = require('jsonwebtoken');

const generateToken = (payload) => {
    const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

    const token = jwt.sign({ user: payload }, PRIVATE_KEY, { expiresIn: '24h' });

    return token;
}

module.exports = generateToken;