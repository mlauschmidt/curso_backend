const { cartService, productService } = require('../services/index');

class CartController {
    constructor () {
        this.service = cartService;
        this.productService = productService;
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
            const newCart = await this.service.createCart();
            
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

            const prodIndex = updatedCart.products.findIndex(product => product.product.id.toString() === productId);
            const prod = updatedCart.products[prodIndex];
            const updatedProd = {...prod, cartId, newTotal: updatedCart.total};
            
            io.emit('producto_agregado_carrito', JSON.stringify(updatedProd));

            return res.status(200).json(updatedCart);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        }
    }
  
    async deleteCart (req, res) {
        try {
            const cartId = req.params.cid;
            const cart = await this.service.deleteCart(cartId);
            
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
            const cart = await this.service.getCartById(cartId);
            const newTotal = cart.total;
            
            io.emit('producto_eliminado_carrito', JSON.stringify({product: deletedProd, newTotal}));
        
            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
}

module.exports = CartController;