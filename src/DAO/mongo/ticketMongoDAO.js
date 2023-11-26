const ticketModel = require('./models/ticket.model');

class TicketManager {
    constructor (cartManager, productManager) {
        this.model = ticketModel;
        this.cartManager = cartManager;
        this.productManager = productManager;
    }

    async getTickets () {
        const tickets = await this.model.find();

        if (tickets) {
            return tickets;
        } else {
            console.log('No se pudo acceder a la base de datos.');
            throw new Error('No se pudo acceder a la base de datos.');
        }
    }

    async getTicketById (ticketId) {
        const ticket = await this.model.findById(ticketId).populate('products').lean();

        if (ticket) {
            return ticket;
        } else {
            console.log('Not found.');
            throw new Error('Ticket inexistente.');
        }
    }

    async createTicket (data) {
        //Generacion de codigo unico
        const generateCode = () => Math.floor(999 + Math.random() * 9000);
        const codeExists = async (code) => await this.model.findOne({code});
        const uniqueCode = async () => {
            let code = generateCode();
          
            while (await codeExists(code)) {
              code = generateCode();
            }
          
            return code;
        };

        //Generacion de fecha y hora
        const generateDateTime = async () => {
            const timestamp = Date.now();
            const date = new Date(timestamp);
            const formattedDate = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}:${date.getSeconds().toString().padStart(2, '0')}`;

            return formattedDate;
        };

        //Verificacion de productos disponibles
        const availableProducts = async () => {
            let products = [];
            const cartId = data.cartId;
            const selectedProducts = await this.cartManager.getCartById(cartId);

            await Promise.all (selectedProducts.products.map(async (prod) => {
                const prodId = prod.product._id;
                const product = await this.productManager.getProductById(prodId);

                if (product.stock >= prod.quantity) {
                    console.log('Stock suficiente');
                    const data = { stock: product.stock - prod.quantity };
                    const newStock = await this.productManager.updateProduct (prodId, data);
                    products.push({
                        product: newStock,
                        quantity: prod.quantity,
                        subtotal: newStock.price * prod.quantity
                    })
                    await this.cartManager.deleteProductInCart (cartId, prodId);
                } else {
                    console.log('No hay stock suficiente');
                }
            }))

            return products;
        }

        //Creacion de ticket
        try {
            const code = await uniqueCode();
            const purchase_datetime = await generateDateTime();
            const products = await availableProducts();
            const amount = products.reduce((acc, prod) => {
                return acc + prod.subtotal;
            }, 0);

            const newTicket = {
                code, 
                purchase_datetime,
                purchaser: data.purchaser, 
                products,
                amount
            };

            const ticketCreated = await this.model.create(newTicket);
            console.log('Ticket creado correctamente.');
            return ticketCreated;
        } catch (err) {
            console.log('Error al crear el ticket.', err);
            throw new Error('Error al crear el ticket.');
        }
    }
}

module.exports = TicketManager;