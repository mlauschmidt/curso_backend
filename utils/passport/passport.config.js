const passport = require('passport');
const registerLocalStrategy = require('../passport/strategies/registerLocalStrategy');
const loginLocalStrategy = require('../passport/strategies/loginLocalStrategy');
const gitHubStrategy = require('../passport/strategies/gitHubStrategy');
const jwtStrategy = require('../passport/strategies/JWTStrategy');

const initializePassport = () => {
    passport.use('register', registerLocalStrategy)

    passport.use('login', loginLocalStrategy)

    passport.use('github', gitHubStrategy)

    passport.use('jwt', jwtStrategy)
}

module.exports = initializePassport;