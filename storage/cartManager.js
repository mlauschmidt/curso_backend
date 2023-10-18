const cartModel = require('./models/cart.model');
const ProductManager = require('./productManager');
const productManager = new ProductManager();

class CartManager {
    constructor () {
        this.model = cartModel;
    }

    async getCarts () {
        const carts = await this.model.find().lean()/* .populate('products.product') */;

        if (carts) {
            return carts;
        } else {
            console.log('No se pudo acceder a la base de datos.');
            throw new Error('No se pudo acceder a la base de datos.');
        }
    }

    async getCartById (cartId) {
        const cart = await this.model.findById(cartId).populate('products.product').lean();
        cart.products = cart.products.map(product => product = {...product, cartId: cartId});

        //Influye en algo si borro la linea 23 donde agrego el cartId a cada producto del carrito?
        //Si, en el deleteProduct de cart.js, pero puedo reemplazarlo tomando el id del carrito de la sesion como hago en addproduct

        if (cart) {
            return cart;
        } else {
            console.log('Not found.');
            throw new Error('Carrito inexistente.');
        }
    }

    async createCart () {
        const newCart = {
            products: []
        }; 

        const cartCreated = await this.model.create(newCart);

        if (cartCreated) {
            console.log('Carrito creado correctamente.');
            return cartCreated;
        } else {
            console.log('Error al crear el carrito.');
            throw new Error('Error al crear el carrito.');
        }
    }
  
    async updateCart (cartId, productId, quantity) {
        const cart = await this.getCartById(cartId);
        
        if (cart) {
            const productExists = cart.products.findIndex(product => product.product._id.toString() === productId);

            if (!(productExists === -1)) {
                try {
                    const qty = () => {
                        if (quantity){
                            return quantity; 
                        } else {
                            quantity = cart.products[productExists].quantity + 1

                            return quantity;
                        }
                    } 

                    const updateCart = await this.model.updateOne({_id: cartId, 'products.product': productId}, {$set: {'products.$.quantity': qty()}});

                    console.log('Carrito actualizado correctamente.');

                    return {status: updateCart, quantity};
                } catch (err) {
                    console.log('Error al actualizar el carrito.', err);
                    throw new Error('Error al actualizar el carrito.');
                }
            } else {
                try {
                    const addProduct = {
                        product: productId,
                        quantity: quantity || 1
                    }

                    const updateCart = await this.model.updateOne({_id: cartId}, {$push: {products: addProduct}});

                    console.log('Carrito actualizado correctamente.');
    
                    return {status: updateCart, quantity: addProduct.quantity};
                } catch (err) {
                    console.log('Error al actualizar el carrito.', err);
                    throw new Error('Error al actualizar el carrito.');
                }               
            }
        } else {
            console.log('Not found.');
            throw new Error('Carrito inexistente.');
        }
    }

    async deleteCart (cartId) {
        const cart = await this.getCartById(cartId);

        if (cart) {
            try {
                await this.model.updateOne({_id: cartId}, {$set: {products: []}});

                console.log('Carrito eliminado correctamente.');

                return cart;
            } catch (err) {
                console.log('Error al eliminar el carrito.', err);
                throw new Error('Error al eliminar el carrito.');
            }
        } else {
            console.log('Not found.');
            throw new Error('Carrito inexistente.');
        }
    }

    async deleteProductInCart (cartId, productId) {
        const cart = await this.getCartById(cartId);

        if (cart) {
            //modificar esto como hice con updateproduct
            const productExists = await this.model.findOne({_id: cartId, 'products.product': productId});

            if (productExists) {
                const product = await productManager.getProductById(productId);

                try {
                    await this.model.updateOne({_id: cartId}, {$pull: {products: {product: productId}}});

                    console.log('Producto eliminado correctamente.');

                    return product;
                } catch (err) {
                    console.log('Error al eliminar el producto.', err);
                    throw new Error('Error al eliminar el producto.');
                }
            } else {
                console.log('Not found.');
                throw new Error('Producto inexistente.');
            }
        } else {
            console.log('Not found.');
            throw new Error('Carrito inexistente.');
        }
    }
}

module.exports = CartManager;