const passport = require('passport');
const registerLocalStrategy = require('../strategies/registerLocalStrategy');
const loginLocalStrategy = require('../strategies/loginLocalStrategy');
const gitHubStrategy = require('../strategies/gitHubStrategy');
const jwtStrategy = require('../strategies/JWTStrategy');

const initializePassport = () => {
    passport.use('register', registerLocalStrategy)

    passport.use('login', loginLocalStrategy)

    passport.use('github', gitHubStrategy)

    passport.use('jwt', jwtStrategy)
}

module.exports = initializePassport;