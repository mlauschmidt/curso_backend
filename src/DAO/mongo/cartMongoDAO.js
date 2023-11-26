const cartModel = require('./models/cart.model');

class CartManager {
    constructor (productManager) {
        this.model = cartModel;
        this.productManager = productManager;
    }

    async getCarts () {
        const carts = await this.model.find().populate('products.product').lean();

        if (carts) {
            return carts;
        } else {
            console.log('No se pudo acceder a la base de datos.');
            throw new Error('No se pudo acceder a la base de datos.');
        }
    }

    async getCartById (cartId) {
        const cart = await this.model.findById(cartId).populate('products.product').lean();

        if (cart) {
            return cart;
        } else {
            console.log('Not found.');
            throw new Error('Carrito inexistente.');
        }
    }

    async createCart (data) {
        const cartCreated = await this.model.create(data);

        if (cartCreated) {
            console.log('Carrito creado correctamente.');
            return cartCreated;
        } else {
            console.log('Error al crear el carrito.');
            throw new Error('Error al crear el carrito.');
        }
    }
  
    async updateCart (cartId, productId, quantity) {
        let cart = await this.getCartById(cartId);
        const product = await this.productManager.getProductById(productId);
        
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
                    
                    const updateData = {
                        $set: {
                            'products.$.quantity': qty(),
                            'products.$.subtotal': qty() * product.price,
                            total: cart.products.reduce((acc, prod) => acc + prod.subtotal, 0) + qty() * product.price
                        }
                    };
                      
                    await this.model.updateOne({ _id: cartId, 'products.product': productId }, updateData);
                    cart = await this.getCartById(cartId);
                    await this.model.updateOne({ _id: cartId}, { total: cart.products.reduce((acc, prod) => acc + prod.subtotal, 0)});
                    const updatedCart = await this.getCartById(cartId);

                    console.log('Carrito actualizado correctamente.');

                    return updatedCart;
                } catch (err) {
                    console.log('Error al actualizar el carrito.', err);
                    throw new Error('Error al actualizar el carrito.');
                }
            } else {
                try {
                    const addProduct = {
                        product: product,
                        quantity: quantity || 1,
                        subtotal: product.price * (quantity || 1)
                    }

                    await this.model.updateOne({_id: cartId}, {$push: {products: addProduct}});
                    cart = await this.getCartById(cartId);
                    await this.model.updateOne({ _id: cartId}, { total: cart.products.reduce((acc, prod) => acc + prod.subtotal, 0)});
                    const updatedCart = await this.getCartById(cartId);

                    console.log('Carrito actualizado correctamente.');
    
                    return updatedCart;
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
                await this.model.updateOne({_id: cartId}, {$set: {products: [], total: 0}});

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
        let cart = await this.getCartById(cartId);

        if (cart) {
            const productExists = await this.model.findOne({_id: cartId, 'products.product': productId});

            if (productExists) {
                const product = await this.productManager.getProductById(productId);

                try {
                    await this.model.updateOne({_id: cartId}, {$pull: {products: {product: productId}}});
                    cart = await this.getCartById(cartId);
                    await this.model.updateOne({ _id: cartId}, { total: cart.products.reduce((acc, prod) => acc + prod.subtotal, 0)});

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