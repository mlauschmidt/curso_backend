const { Router } = require('express');
const sessionRouter = Router();
const userModel = require('../dao/models/user.model');
const { createHash, isValidPassword } = require('../utils/passwordHash');
const passport = require('passport');

sessionRouter.get('/', (req, res) => {
    const user = req.user;

    if (user) {
        return res.json(req.user);
    } else {
        return res.json({});
    }
})

sessionRouter.post('/register', passport.authenticate('register', {failureRedirect: '/failregister'}), async (req, res) => {
    return res.redirect('/login');
})

sessionRouter.get('/failregister', (req, res) => {
    return res.json({
        error: 'Error al registrarse.'
    })
})

sessionRouter.post('/login', passport.authenticate('login', {failureRedirect: '/faillogin'}), async (req, res) => {
    return res.redirect(`/products?cart=${req.user.cartId}`);
})

sessionRouter.get('/faillogin', (req, res) => {
    return res.json({
        error: 'Error al iniciar sesión.'
    })
})

sessionRouter.get('/github', passport.authenticate('github', {scope: ['user: email']}), async (req, res) => {

})

sessionRouter.get('/github-callback', passport.authenticate('github', {failureRedirect: '/login'}), async (req, res) => {
    return res.redirect(`/products?cart=${req.user.cartId}`);
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

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err){
            return res.status(500).json({error: err});
        }
    
        return res.redirect('/products');
    })
})

module.exports = sessionRouter;