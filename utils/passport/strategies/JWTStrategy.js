const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const headerExtractor = (req) => {
    return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
}

const jwtStrategy = new JWTStrategy({
    jwtFromRequest: extractJWT.fromExtractors([headerExtractor]),
    secretOrKey: 'jwtsecret'
}, (jwtPayload, done) => {
    if (!jwtPayload.user) {
        console.log('El usuario no existe en el sistema.');
        return done(null, false, {message: 'Token inválido'});
    }

    return done(null, jwtPayload.user)
})

module.exports= jwtStrategy;
