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
    const cart = req.query.cart;
    const limit = req.query.limit || 5;
    const page = req.query.page || 1;
    const sort = req.query.sort;
    const query = req.query.query;    
    const products = await productManager.getProducts(limit, page, sort, query);

    const hasCartParam = () => {
        if (cart === undefined){
            return true;
        } else {
            return false;
        }
    }
    hasCartParam();

    const params = {
        title: 'Productos',
        products,
        hasCartParam: hasCartParam(),
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

viewsRouter.post('/user', async (req, res) => {
    const user = req.body.user;
    const cart = await cartManager.createCart();
    console.log(cart);

    return res.redirect(`/products?cart=${cart._id}`);
})

//Chat
viewsRouter.get('/login', (req, res) => {
    return res.render('login', {title: 'Inicio de sesión'});
})

viewsRouter.post('/login', async (req, res) => {
    const user = req.body.user;

    return res.redirect(`/chat?username=${user}`);
})

viewsRouter.get('/chat', (req, res) => {
    return res.render('chat', {title: 'Chat'});
})

module.exports = viewsRouter;