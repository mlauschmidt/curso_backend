const { Router } = require('express');
const viewsRouter = Router();
const UserService = require('../services/userService');
const userService = new UserService();
const ProductService = require('../services/productService');
const productService = new ProductService();
const CartService = require('../services/cartService');
const cartService = new CartService();

viewsRouter.get('/products', async (req, res) => {
    const id = req.query.id;
    const user = await userService.getUser(null, null, id);
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const query = req.query.query;    
    const products = await productService.getProducts(limit, page, sort, query);

    const params = {
        title: 'Productos',
        products,
        user,
        userLogged: user._id !== undefined,
        hasIdParam: id === undefined,
        idLink: `&id=${id}`
    }

    if (user.role === 'admin') {
        return res.render('inventory', params);
    } else {
        return res.render('products', params);
    }
})

viewsRouter.get('/carts/:cid([0-9a-fA-F]{24})', async (req, res) => {
    const cartId = req.params.cid;
    const cart = await cartService.getCartById(cartId);
    const user = await userService.getUser(null, null, null, cartId);

    const params = {
        title: 'Carrito de compras',
        cart,
        userId: user._id
    }

    return res.render('cart', params);
})

viewsRouter.get('/carts/:cid', (req, res) => {
    return res.send(`Identificador de carrito de compras (${req.params.cid}) inválido.`);
})

//REVISAR ESTE MIDDLEWARE
/* const sessionMiddleware = (req, res, next) => {
    if (req.user && req.user.cartId) {
        return res.redirect(`/products?cart=${req.user.cartId}`);
    }

    return next();
} */

viewsRouter.get('/register', /* sessionMiddleware, */ (req, res) => {
    const params = {
        title: 'Registrarse'
    }

    return res.render('register', params);
})

viewsRouter.get('/login', /* sessionMiddleware, */ (req, res) => {
    const params = {
        title: 'Inicar sesión'
    }

    return res.render('login', params);
})

viewsRouter.get('/github-data', (req, res) => {
    return res.render('github');
})

viewsRouter.get('/recovery-password', /* sessionMiddleware, */ (req, res) => {
    const params = {
        title: 'Reestablecer contraseña'
    }

    return res.render('recovery-password', params);
}) 

//TERMINAR LAS VISTAS DE ESTE ENDPOINT
viewsRouter.get('/profile', (req, res) => {
    const params = {
        title: 'Perfil',
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