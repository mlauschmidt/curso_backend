const { Router } = require('express');
const viewsRouter = Router();
/* const ProductManager = require('../storage/fileSystemProductManager'); */
const ProductManager = require('../storage/productManager');
const productManager = new ProductManager('./products.json');
/* const CartManager = require('../storage/fileSystemCartManager'); */
const CartManager = require('../storage/cartManager');
const cartManager = new CartManager('./carts.json');
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

    const params = {
        title: 'Productos',
        products,
        hasCartParam: cart === undefined,
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
        return res.redirect(`/products?cart=${req.user.cartId}`);
    }

    return next();
}

viewsRouter.get('/register', sessionMiddleware, (req, res) => {
    const params = {
        title: 'Registrarse'
    }

    return res.render('register', params);
})

viewsRouter.get('/login', sessionMiddleware, (req, res) => {
    const params = {
        title: 'Inicar sesión'
    }

    return res.render('login', params);
})

viewsRouter.get('/github-data', (req, res) => {
    return res.render('github');
})

viewsRouter.get('/recovery-password', sessionMiddleware, (req, res) => {
    return res.render('recovery-password', {title: 'Reestablecer contraseña'});
}) 

viewsRouter.get('/profile', passportCall('jwt'), (req, res, next) => {
    const user = req.user;
    console.log(user);

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