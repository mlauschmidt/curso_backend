const jwt = require('jsonwebtoken');
const PRIVATE_KEY = process.env.JWT_PRIVATE_KEY;

const generateToken = (payload) => {
    const token = jwt.sign({ user: payload }, PRIVATE_KEY, { expiresIn: '24h' });

    return token;
}

const verifyToken = (token) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, PRIVATE_KEY, (err, payload) => {
        if (err) {
          return reject(err)
        }
  
        return resolve(payload)
      })
    })
}

module.exports = { generateToken, verifyToken };