const CartDTO = require('../DAO/DTO/cartDTO');
const ProductDTO = require('../DAO/DTO/productDTO');

class CartService {
    constructor (dao) {
        this.dao = dao;
    }
  
    async getCarts () {
        const carts = await this.dao.getCarts();
        const cartsDTO = carts.map(cart => new CartDTO(cart));

        return cartsDTO;
    }
  
    async getCartById (cartId) {
        const cart = await this.dao.getCartById(cartId);
        const cartDTO = new CartDTO(cart);

        return cartDTO;
    }
  
    async createCart () {
        const newCart = await this.dao.createCart();
        const cartDTO = new CartDTO(newCart);

        return cartDTO;
    }
  
    async updateCart (cartId, productId, quantity) {
        const updatedCart = await this.dao.updateCart(cartId, productId, quantity);
        const cartDTO = new CartDTO(updatedCart);

        return cartDTO;
    }
  
    async deleteCart (cartId) {
        const cart = await this.dao.deleteCart(cartId);
        const cartDTO = new CartDTO(cart);

        return cartDTO;
    }

    async deleteProductInCart (cartId, productId) {
        const deletedProd = await this.dao.deleteProductInCart(cartId, productId);
        const productDTO = new ProductDTO(deletedProd);

        return productDTO;
    }
}

module.exports = CartService;