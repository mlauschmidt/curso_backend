const {Command} = require('commander');
const dotenv = require('dotenv');
const configFn = require('../../utils/config');
const DB = require('../../db/singleton');

//Configuracion argumentos
const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'dev');
program.parse();
const options = program.opts();
console.log(options);

//Configuracion variables de entorno
dotenv.config({
    path: `./.env.${options.mode}`
});
const settings = configFn();

class Data {
    static createManager () {
        let ProductManager;
        let productManager;
        let CartManager;
        let cartManager;
        let UserManager;
        let userManager;
        let TicketManager;
        let ticketManager;

        switch (settings.persistence) {
            case "mongo": 
                const dbConnection = DB.getConnection(settings);

                ProductManager = require('./mongo/productMongoDAO');
                productManager = new ProductManager();
                
                CartManager = require('./mongo/cartMongoDAO');
                cartManager = new CartManager(productManager);

                UserManager = require('./mongo/userMongoDAO');
                userManager = new UserManager();

                TicketManager = require('./mongo/ticketMongoDAO');
                ticketManager = new TicketManager(cartManager, productManager);

                return {productManager, cartManager, userManager, ticketManager};

            case "fileSystem":
                ProductManager = require('./fileSystem/productFileDAO');
                productManager = new ProductManager('products.json');

                CartManager = require('./fileSystem/cartFileDAO');
                cartManager = new CartManager('carts.json');

                UserManager = require('./fileSystem/userFileDAO');
                userManager = new UserManager('users.json');

                TicketManager = require('./fileSystem/ticketFileDAO');
                ticketManager = new TicketManager('tickets.json');

                return {productManager, cartManager, userManager, ticketManager};

            default:
                throw new Error('Fuente de datos no válida');
        }
    }
}

module.exports = Data;