const passport = require('passport');
const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const GitHubStrategy = require('passport-github2');
const userModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils/passwordHash');
/* const CartManager = require('../dao/fileSystemCartManager'); */
const CartManager = require('../dao/mongooseCartManager');
const cartManager = new CartManager('./carts.json');

const initializePassport = () => {
    passport.use('register', new LocalStrategy(
        {passReqToCallback: true, usernameField: 'username'},
        async (req, username, password, done) => {
            try {
                const user = await userModel.findOne({ "$or": [{username: username}, {email: req.body.email}]});
    
                if (user) {
                    console.log('Usuario ya existe.');
                    return done(null, false);
                }
        
                const body = req.body;
                body.password = createHash(body.password);
                
                const newUser = await userModel.create(body);
        
                return done(null, newUser);
            } catch (e) {
                return done(e);
            }
        }
    ))

    passport.use('login', new LocalStrategy(
        {usernameField: 'username'},
        async (username, password, done) => {
            try {
                let user = await userModel.findOne({ "$or": [{username: username}, {email: username}]});

                const cart = await cartManager.createCart();

                if (!user){
                    console.log('El usuario no existe en el sistema.');
                    return done(null, false);
                }

                if (!isValidPassword(password, user.password)){
                    console.log('Datos incorrectos.');
                    return done(null, false);
                }

                user = user.toObject();
                delete user.password;
                user.cartId = cart._id;

                return done(null, user);
            } catch (e) {
                return done(e);
            }
        }
    ))

    passport.use('github', new GitHubStrategy({
        clientID: 'Iv1.3305fae6500a731e',
        clientSecret: '2926f9e243a192d595a6cad5c1febbfc3bf75d35',
        callbackURL: 'http://localhost:8080/api/sessions/github-callback'
    }, async (accessToken, refreshToken, profile, done) => {
        /* console.log({profile}); */

        try {
            let user = await userModel.findOne({ "$or": [{username: profile._json.login}, {email: profile._json.email}]});

            const cart = await cartManager.createCart();

            if (user) {
                console.log('Usuario ya existe.');

                user = user.toObject();
                user.cartId = cart._id;

                return done(null, user);
            }

            let newUser = await userModel.create({
                name: profile._json.name,
                username: profile._json.login,
                email: profile._json.email
            });

            user = newUser.toObject();
            user.cartId = cart._id;

            return done(null, user);
        } catch (e) {
            return done(e);
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, {_id: user._id, cartId: user.cartId});
    })

    passport.deserializeUser(async (user, done) => {
        let deserializedUser = await userModel.findOne({_id: user._id});

        deserializedUser = deserializedUser.toObject();
        delete deserializedUser.password;
        deserializedUser.cartId = user.cartId;

        done(null, deserializedUser);
    })
}

module.exports = initializePassport;