const GitHubStrategy = require('passport-github2');
const { userService, cartService } = require('../../../src/services/index');
const { generateToken } = require('../../jwt');

const gitHubStrategy = new GitHubStrategy({
    clientID: 'Iv1.3305fae6500a731e',
    clientSecret: '2926f9e243a192d595a6cad5c1febbfc3bf75d35',
    callbackURL: 'http://localhost:8080/api/sessions/github-callback'
}, async (accessToken, refreshToken, profile, done) => {
    try {
        const name = profile._json.name;
        const username = profile._json.login;
        const email = profile._json.email;
        let user = await userService.getUser(username, email);

        const data = {
            name,
            username,
            email
        }

        if (user.id) {
            console.log('Usuario ya registrado.');

            if (!user.cartId) {
                const cart = await cartService.createCart();
                user = await userService.updateUser(username, email, {...data, cartId: cart.id});
            }
            
            const token = generateToken(user);

            /* console.log({github: user}); */
            return done(null, token);
        }

        const cart = await cartService.createCart();
        newUser = await userService.createUser({...data, cartId: cart.id});

        const token = generateToken(newUser);

        /* console.log({githubnew: newUser}); */
        return done(null, token);
    } catch (e) {
        return done(e);
    }
})

module.exports = gitHubStrategy;