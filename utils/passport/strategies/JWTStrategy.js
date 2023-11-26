const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const extractJWT = passportJWT.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;

    if (req && req.signedCookies) {
        token = req.signedCookies['authTokenCookie'];
    }
    
    return token;
}

const jwtOptions = {
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
