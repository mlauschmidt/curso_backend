const cartModel = require('./models/cart.model');
const ProductManager = require('./mongooseProductManager');
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
            const productExists = await this.model.findOne({_id: cartId, 'products.product': productId});

            if (productExists) {
                try {
                    const updateCart = await this.model.updateOne({_id: cartId, 'products.product': productId}, {$set: {'products.$.quantity': quantity}});

                    console.log('Carrito actualizado correctamente.');
                    
                    return updateCart;
                } catch (err) {
                    console.log('Error al actualizar el carrito.', err);
                    throw new Error('Error al actualizar el carrito.');
                }
            } else {
                try {
                    const addProduct = {
                        product: productId,
                        quantity: quantity
                    }
    
                    const updateCart = await this.model.updateOne({_id: cartId}, {$push: {products: addProduct}});

                    console.log('Carrito actualizado correctamente.');
    
                    return updateCart;
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
                await this.model.deleteOne({_id: cartId});

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