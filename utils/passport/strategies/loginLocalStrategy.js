const passportLocal = require('passport-local');
const LocalStrategy = passportLocal.Strategy;
const UserService = require('../../../services/userService');
const userService = new UserService();
const CartService = require('../../../services/cartService');
const cartService = new CartService();
const generateToken = require('../../jwt');

const loginLocalStrategy = new LocalStrategy(
    {usernameField: 'username'},
    async (username, password, done) => {
        try {
            const email = username;
            const user = await userService.getUser(username, email);
            
            if (!user._id){
                console.log('El usuario no existe en el sistema.');
                return done(null, false, {message: 'El usuario no existe en el sistema.'});
            }

            let userValidated = await userService.validatePassword(user._id, password);

            if (userValidated._id) {
                if (!userValidated.cartId) {
                    const cart = await cartService.createCart();
                    const data = {...userValidated, cartId: cart._id};

                    userValidated = await userService.updateUser(username, email, data);
                }

                const token = generateToken(userValidated);

                /* console.log({login: userValidated}); */
                return done(null, token);
            } else {
                console.log('Datos incorrectos.');
                return done(null, false, {message: 'Datos incorrectos.'});
            }
        } catch (e) {
            return done(e);
        }
    }
)

module.exports= loginLocalStrategy;