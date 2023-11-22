const { Router } = require('express');
const viewsRouter = Router();
const { userService, productService, cartService } = require('../services/index');
const UserMiddlewares = require('../../middlewares/userMiddlewares');
const usersMiddlewares = new UserMiddlewares();

const sessionMiddleware = (req, res, next) => {
    if (req.user) {
        return res.redirect(`/home/${req.user.id}`);
    }

    return next();
} 

viewsRouter.get('/home', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('admin', 'user'),
    sessionMiddleware,
    async (req, res) => {
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;
        const sort = req.query.sort;
        const query = req.query.query;    
        const products = await productService.getProducts(limit, page, sort, query);
        
        const params = {
            title: 'Productos',
            products
        }
        
        return res.render('home', params);
    }
)

viewsRouter.get('/home/:uid', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('admin', 'user'),
    async (req, res) => {
        /* const userId = req.params.uid;
        const user = await userService.getUser(null, null, userId); */
        const user = req.user;
        const limit = req.query.limit || 5;
        const page = req.query.page || 1;
        const sort = req.query.sort;
        const query = req.query.query;    
        const products = await productService.getProducts(limit, page, sort, query);
        
        const params = {
            title: 'Productos',
            user,
            products,
            userLogged: user.id !== undefined,
            /* hasIdParam: userId === undefined,
            idLink: `/${userId}` */
        }
        
        if (user.role === 'admin') {
            return res.render('inventory', params);
        } else {
            return res.render('home', params);
        }
    }
)

viewsRouter.get('/carts/:cid', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('user'),
    async (req, res) => {
        const cartId = req.params.cid;
        const cart = await cartService.getCartById(cartId);
        /* const user = await userService.getUser(null, null, null, cartId); */
        const user = req.user;
        
        const params = {
            title: 'Carrito de compras',
            cart,
            userId: user.id
        }

        return res.render('cart', params);
    }
)

viewsRouter.get('/register', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('admin', 'user'),
    sessionMiddleware,
    (req, res) => {
        const params = {
            title: 'Registrarse'
        }

        return res.render('register', params);
    }
)

viewsRouter.get('/login', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('admin', 'user'),
    sessionMiddleware,
    (req, res) => {
        const params = {
            title: 'Inicar sesión'
        }

        return res.render('login', params);
    }
)

viewsRouter.get('/github-data', (req, res) => {
    return res.render('github');
})

//REVISAR ESTE ENDPOINT
viewsRouter.get('/recovery-password', (req, res) => {
    const params = {
        title: 'Reestablecer contraseña'
    }

    return res.render('recovery-password', params);
}) 

viewsRouter.get('/profile/:uid', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('admin', 'user'),
    async (req, res) => {
        /* const userId = req.params.uid;
        const user = await userService.getUser(null, null, userId); */
        const user = req.user;

        const params = {
            title: 'Perfil',
            user
        }

        return res.render('profile', params);
    }
)

/* viewsRouter.post('/login', async (req, res) => {
    const user = req.body.user;

    return res.redirect(`/chat?username=${user}`);
})

viewsRouter.get('/chat', 
    usersMiddlewares.authentication({strategy: 'jwt'}), 
    usersMiddlewares.authorization('user'),
    (req, res) => {
        return res.render('chat', {title: 'Chat'});
    }
) */

module.exports = viewsRouter;