const { Router } = require('express');
const sessionRouter = Router();
const userModel = require('../dao/models/user.model');
/* const CartManager = require('../dao/fileSystemCartManager'); */
const CartManager = require('../dao/mongooseCartManager');
const cartManager = new CartManager('./carts.json');

sessionRouter.get('/', (req, res) => {
    const user = req.session.user;

    if (user) {
        return res.json(req.session.user);
    } else {
        return res.json({});
    }
})

sessionRouter.post('/register', async (req, res) => {
    const user = await userModel.create(req.body);

    return res.redirect('/login');
})

sessionRouter.post('/login', async (req, res) => {
    let user = await userModel.findOne({email: req.body.email});
    const cart = await cartManager.createCart();
 
    if (!user){
        return res.status(401).json({
            error: 'El usuario no existe en el sistema.'
        })
    }

    if (user.password !== req.body.password){
        return res.status(401).json({
            error: 'Datos incorrectos.'
        })
    }

    user = user.toObject();
    delete user.password;
    req.session.user = {...user, cartId: cart._id};

    return res.redirect(`/products?cart=${cart._id}`);
})

sessionRouter.get('/logout', (req, res) => {
    console.log(req.session);

    req.session.destroy(err => {
        if (err){
            return res.status(500).json({error: err});
        }
    
        return res.redirect('/products');
    })
})

module.exports = sessionRouter;