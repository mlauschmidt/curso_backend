const jwt = require('jsonwebtoken');

const PRIVATE_KEY = 'jwtsecret';

const generateToken = (payload) => {
    const token = jwt.sign({ user: payload }, PRIVATE_KEY, { expiresIn: '24h' });

    return token;
}

module.exports = generateToken;