const { Router } = require('express');
const viewsRouter = Router();
/* const ProductManager = require('../dao/fileSystemProductManager'); */
const ProductManager = require('../dao/mongooseProductManager');
const productManager = new ProductManager('./products.json');
/* const CartManager = require('../dao/fileSystemCartManager'); */
const CartManager = require('../dao/mongooseCartManager');
const cartManager = new CartManager('./carts.json');

viewsRouter.get('/home', async (req, res) => {
    const limit = req.query.limit || 10;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const query = req.query.query;
    let products = await productManager.getProducts(limit, page, sort, query);

    const params = {
        title: 'Inicio',
        products
    }

    return res.render('home', params);
})

viewsRouter.get('/products', async (req, res) => {
    const user = req.user;
    const cart = req.query.cart;
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const query = req.query.query;    
    const products = await productManager.getProducts(limit, page, sort, query);

    const params = {
        title: 'Productos',
        products,
        hasCartParam: cart === undefined,
        user,
        cart,
        cartLink: `&cart=${cart}`
    }

    return res.render('products', params);
})

viewsRouter.get('/carts/:cid', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartManager.getCartById(cartId);
    
    const params = {
        title: 'Carrito de compras',
        cart
    }

    return res.render('cart', params);
})

const sessionMiddleware = (req, res, next) => {
    if (req.user && req.user.cartId) {
        return res.redirect('/profile');
    }

    return next();
}

viewsRouter.get('/register', sessionMiddleware, (req, res) => {
    const error = req.flash('error')[0];

    const params = {
        title: 'Registrarse',
        error,
        hasError: error !== undefined
    }

    return res.render('register', params);
})

viewsRouter.get('/login', sessionMiddleware, (req, res) => {
    const error = req.flash('error')[0];

    const params = {
        title: 'Inicar sesión',
        error,
        hasError: error !== undefined
    }

    return res.render('login', params);
})

viewsRouter.get('/recovery-password', sessionMiddleware, (req, res) => {
    return res.render('recovery-password', {title: 'Reestablecer contraseña'});
}) 

viewsRouter.get('/profile', (req, res, next) => {
    if (!req.user) {
        return res.redirect('/login');
    }

    return next();
}, (req, res) => {
    const user = req.user;

    const params = {
        title: 'Perfil',
        user
    }

    return res.render('profile', params);
})

/* viewsRouter.post('/login', async (req, res) => {
    const user = req.body.user;

    return res.redirect(`/chat?username=${user}`);
})

viewsRouter.get('/chat', (req, res) => {
    return res.render('chat', {title: 'Chat'});
}) */

module.exports = viewsRouter;