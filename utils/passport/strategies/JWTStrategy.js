const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

/* const headerExtractor = (req) => {
    return req.headers && req.headers['authorization'] && req.headers['authorization'].replace('Bearer ', '')
} */

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.cookies) {
        token = req.cookies['authTokenCookie'];
    }
    return token;
}

const jwtOptions = {
    /* jwtFromRequest: extractJWT.fromExtractors([headerExtractor]), */
    jwtFromRequest: extractJWT.fromExtractors([cookieExtractor]),
    secretOrKey: process.env.JWT_PRIVATE_KEY
}

const jwtStrategy = new JWTStrategy(jwtOptions, (jwtPayload, done) => {
    if (!jwtPayload.user) {
        console.log(jwtPayload.user);
        console.log('El usuario no existe en el sistema.');
        return done(null, false, {message: 'Token inválido'});
    }

    return done(null, jwtPayload.user)
})

module.exports= jwtStrategy;
