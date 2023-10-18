const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const headerExtractor = (req) => {
    /* console.log(req.cookies)
    return req.cookies && req.cookies.authTokenCookie */

    return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
}

const jwtStrategy = new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([headerExtractor]),
    secretOrKey: 'jwtsecret'
}, (jwtPayload, done) => {
    return done(null, jwtPayload.user)
})

module.exports= jwtStrategy;
