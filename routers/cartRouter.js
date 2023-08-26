const { Router } = require('express');
const cartRouter = Router();
/* const CartManager = require('../dao/fileSystemCartManager'); */
const CartManager = require('../dao/mongooseCartManager');
const cartManager = new CartManager('./carts.json');

cartRouter.get('/', async (req, res) => {
    try {
        const carts = await cartManager.getCarts();

        return res.json(carts);
    } catch (err) {
        return res.status(404).json({
            error: err.message
        });
    }
})

cartRouter.get('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.getCartById(req.params.cid);

        return res.json(cart);
    } catch (err) {
        return res.status(404).json({
            error: err.message
        });
    }
})

cartRouter.post('/', async (req, res) => {
    try {
        const newCart= await cartManager.createCart();

        return res.status(201).json(newCart);
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }    
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const quantity = req.body.quantity;
        const updatedCart = await cartManager.updateCart(cartId, productId, quantity);

        return res.status(200).json(updatedCart);
    } catch (err) {
        return res.status(400).json({
            error: err.message
        });
    }
})

cartRouter.delete('/:cid', async (req, res) => {
    try {
        const cart = await cartManager.deleteCart (req.params.cid);
        
        return res.status(204).json({});
    } catch (err) {
        return res.status(404).json({
            error: err.message
        });
    }
})

cartRouter.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const cartId = req.params.cid;
        const productId = req.params.pid;
        const updatedCart = await cartManager.deleteProductInCart(cartId, productId);
    
        return res.status(204).json({});
    } catch (err) {
        return res.status(404).json({
            error: err.message
        });
    }
})

module.exports = cartRouter;