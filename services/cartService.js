const CartManager = require('../storage/cartManager');

class CartService {
    constructor () {
        this.storage = new CartManager();
    }
  
    getCarts () {
        return this.storage.getCarts();
    }
  
    getCartById (cartId) {
        return this.storage.getCartById(cartId);
    }
  
    createCart () {
        return this.storage.createCart();
    }
  
    updateCart (cartId, productId, quantity) {
        return this.storage.updateCart(cartId, productId, quantity);
    }
  
    deleteCart (cartId) {
        return this.storage.deleteCart(cartId);
    }

    deleteProductInCart (cartId, productId) {
        return this.storage.deleteProductInCart(cartId, productId);
    }
}

module.exports = CartService;