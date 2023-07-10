const { Router } = require('express');
const cartRouter = Router();

const CartManager = require('../CartManager');
const cartManager = new CartManager('./carts.json');

cartRouter.get('/', async (req, res) => {
    const carts = await cartManager.getCarts();

    return res.json(carts);
})

cartRouter.post('/', async (req, res) => {
    const newCart= await cartManager.createCart();

    if (!newCart) {
        return res.status(404).json({
            error: 'Error al crear el carrito'
        });
    }

    return res.status(201).json(newCart);
})

cartRouter.get('/:cid', async (req, res) => {
    const cart = await cartManager.getCartById(parseInt(req.params.cid));

    if (!cart) {
        return res.status(404).json({
            error: 'Cart not found'
        });
    }
    
    return res.json(cart);
})

cartRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = parseInt(req.params.cid);
    const productId = parseInt(req.params.pid);
    const quantity = req.body;
    const updatedCart = await cartManager.updateCart(cartId, productId, quantity);

    if (!updatedCart.id) {
        return res.status(404).json({
            error: `Error al agregar el producto. ${updatedCart}`

        });
    }

    return res.status(200).json(updatedCart);
})

module.exports = cartRouter;