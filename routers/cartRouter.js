const { Router } = require('express');
const cartRouter = Router();
const CartController = require('../controllers/cartController');
const cartController = new CartController();

const cartRouterFn = (io) => {
    cartRouter.get('/', cartController.getCarts.bind(cartController));

    cartRouter.get('/:cid', cartController.getCartById.bind(cartController));

    cartRouter.post('/', cartController.createCart.bind(cartController));

    cartRouter.put('/:cid/products/:pid', (req, res, next) => {
        cartController.updateCart(req, res, io);
    });

    cartRouter.delete('/:cid', cartController.deleteCart.bind(cartController));

    cartRouter.delete('/:cid/products/:pid', (req, res, next) => {
        cartController.deleteProductInCart(req, res, io);
    });

    return cartRouter;
}

module.exports = cartRouterFn;