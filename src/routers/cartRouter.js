const { Router } = require('express');
const cartRouter = Router();
const CartController = require('../controllers/cartController');
const cartController = new CartController();
const UserMiddlewares = require('../../middlewares/userMiddlewares');
const usersMiddlewares = new UserMiddlewares();

const cartRouterFn = (io) => {
    cartRouter.get('/', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('admin', 'user'),
        cartController.getCarts.bind(cartController)
    );

    cartRouter.get('/:cid', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('admin', 'user'),
        cartController.getCartById.bind(cartController)
    );

    cartRouter.post('/', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('admin'),
        cartController.createCart.bind(cartController)
    );

    cartRouter.put('/:cid/products/:pid', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('user'),
        (req, res, next) => {
            cartController.updateCart(req, res, io);
        }
    );

    cartRouter.delete('/:cid', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('admin', 'user'),
        cartController.deleteCart.bind(cartController)
    );

    cartRouter.delete('/:cid/products/:pid', 
        usersMiddlewares.authentication({strategy: 'jwt'}), 
        usersMiddlewares.authorization('user'),
        (req, res, next) => {
            cartController.deleteProductInCart(req, res, io);
        }
    );

    return cartRouter;
}

module.exports = cartRouterFn;