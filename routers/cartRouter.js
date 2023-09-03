const { Router } = require('express');
const cartRouter = Router();
/* const CartManager = require('../dao/fileSystemCartManager'); */
const CartManager = require('../dao/mongooseCartManager');
const cartManager = new CartManager('./carts.json');
/* const ProductManager = require('../dao/fileSystemProductManager'); */
const ProductManager = require('../dao/mongooseProductManager');
const productManager = new ProductManager('./products.json');

const cartRouterFn = (io) => {
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
            const cartId = req.params.cid;
            const cart = await cartManager.getCartById(cartId);

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

    cartRouter.put('/:cid/products/:pid', async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;

            const updatedCart = await cartManager.updateCart(cartId, productId, quantity);
            const product = await productManager.getProductById(productId);

            const updatedProd = {product, quantity: updatedCart.quantity, cartId};

            io.emit('carrito_actualizado', JSON.stringify(updatedProd));

            return res.status(200).json({...updatedCart.status});
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    })

    cartRouter.delete('/:cid', async (req, res) => {
        try {
            const cartId = req.params.cid;
            const cart = await cartManager.deleteCart (cartId);
            
            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })

    cartRouter.delete('/:cid/products/:pid', async (req, res) => {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const deletedProd = await cartManager.deleteProductInCart(cartId, productId);

            io.emit('producto_eliminado', JSON.stringify(deletedProd));
        
            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })

    return cartRouter;
}

module.exports = cartRouterFn;