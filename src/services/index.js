const Data = require('../DAO/factory');
const { productManager, cartManager, userManager } = Data.createManager();

const ProductService = require('../services/productService');
const CartService = require('../services/cartService');
const UserService = require('../services/userService');

const productService = new ProductService(productManager);
const cartService = new CartService(cartManager);
const userService = new UserService(userManager);

module.exports = { productService, cartService, userService };