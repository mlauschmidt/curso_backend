const Data = require('../DAO/factory');
const { productManager, cartManager, userManager, ticketManager } = Data.createManager();

const ProductService = require('../services/productService');
const CartService = require('../services/cartService');
const UserService = require('../services/userService');
const TicketService = require('../services/ticketService');

const productService = new ProductService(productManager);
const cartService = new CartService(cartManager);
const userService = new UserService(userManager);
const ticketService = new TicketService(ticketManager);

module.exports = { productService, cartService, userService, ticketService };