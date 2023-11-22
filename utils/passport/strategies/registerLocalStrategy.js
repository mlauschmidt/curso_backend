const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const { userService } = require('../../../src/services/index');
const generateToken = require('../../jwt');

const registerLocalStrategy = new LocalStrategy(
    {passReqToCallback: true, usernameField: 'username'},
    async (req, username, password, done) => {
        try {
            const email = req.body.email;
            const user = await userService.getUser(username, email);

            if (user.id) {
                console.log('Usuario ya registrado.');
                return done(null, false, {message: 'Usuario ya registrado.'});
            }
            
            const data = req.body;
            const newUser = await userService.createUser(data);
            
            const token = generateToken(newUser);

            /* console.log({register: newUser}); */
            return done(null, token);
        } catch (e) {
            return done(e);
        }
    }
)

module.exports = registerLocalStrategy;