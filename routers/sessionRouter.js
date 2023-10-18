const { Router } = require('express');
const sessionRouter = Router();
const userModel = require('../storage/models/user.model');
const { createHash, isValidPassword } = require('../utils/passwordHash');
const passport = require('passport');

const passportCall = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, (err, user, info) => {
          if (err) {
            return next(err)
          }
    
          if (!user) {
            return res.status(401).json({
              error: info.messages ? info.messages : info.toString()
            })
          }
    
          req.user = user
    
          return next()
        })(req, res, next)
    }
}

sessionRouter.get('/', passportCall('jwt'), (req, res) => {
    const user = req.user;

    if (user) {
        /* console.log({userGet: user}); */
        return res.json(user);
    } else {
        return res.json({});
    }
})

sessionRouter.post('/register', passport.authenticate('register', {session: false, failureRedirect: '/register'}), async (req, res) => {
    return res.redirect('/login');
})

sessionRouter.post('/login', passport.authenticate('login', {session: false, failureRedirect: '/login'}), async (req, res) => {
    return res.json(req.user);
})

sessionRouter.get('/github', passport.authenticate('github', {session: false, scope: ['user: email']}), async (req, res) => {

})

sessionRouter.get('/github-callback', passport.authenticate('github', {session: false, failureRedirect: '/login'}), async (req, res) => {
    return res.redirect(`/github-data?token=${req.user.token}&cart=${req.user.cartId}`);
})

sessionRouter.post('/recovery-password', async (req, res) => {
    const username = req.body.username;
    let user = await userModel.findOne({ "$or": [{username: username}, {email: username}]});
  
    if (!user) {
        return res.status(401).json({
            error: 'El usuario no existe en el sistema.'
        })
    }
  
    const newPassword = createHash(req.body.password);
    await userModel.updateOne({ email: user.email }, { password: newPassword });
  
    return res.redirect('/login');
})

module.exports = sessionRouter;

//DIVIDIR ESTE ARCHIVO EN SESSION CONTROLLER PARA LA LOGICA, VINCULANDOLO AL USER SERVICE PARA EL RECOVERY PASSWORD, Y SESSION ROUTER. 

//HACER LO MISMO CON EL VIEWS ROUTER