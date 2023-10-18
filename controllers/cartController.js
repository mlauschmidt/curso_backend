const CartService = require('../services/cartService');
const ProductService = require('../services/productService');

class CartController {
    constructor () {
        this.service = new CartService();
        this.productService = new ProductService();
    }

    async getCarts (req, res) {
        try {
            const carts = await this.service.getCarts();

            return res.json(carts);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
     
    async getCartById (req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.service.getCartById(cartId);

            return res.json(cart);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async createCart (req, res) {
        try {
            const newCart= await this.service.createCart();

            return res.status(201).json(newCart);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }   
    }
  
    async updateCart (req, res, io) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const quantity = req.body.quantity;

            const updatedCart = await this.service.updateCart(cartId, productId, quantity);
            const product = await this.productService.getProductById(productId); //traerlo desde el manager como en products

            const updatedProd = {product, quantity: updatedCart.quantity, cartId};

            io.emit('carrito_actualizado', JSON.stringify(updatedProd));

            return res.status(200).json({...updatedCart.status});
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }
  
    async deleteCart (req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.service.deleteCart (cartId);
            
            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }

    async deleteProductInCart (req, res, io) {
        try {
            const cartId = req.params.cid;
            const productId = req.params.pid;
            const deletedProd = await this.service.deleteProductInCart(cartId, productId);

            io.emit('producto_eliminado', JSON.stringify(deletedProd));
        
            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
}

module.exports = CartController;