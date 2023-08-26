const fs = require('fs');

const ProductManager = require('./fileSystemProductManager');
const productManager = new ProductManager('./products.json');

class CartManager {
    constructor (path) {
        this.path = path;
    }

    getCarts () {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((contenidoArchivo) => {
                const carts = JSON.parse(contenidoArchivo); 
                return carts;
            })
            .catch((err) => {
                console.log('No se pudo acceder a la base de datos.', err);
                throw new Error('No se pudo acceder a la base de datos.');
            })
    }

    getCartById (cartId) {
        cartId = parseInt(cartId);

        return this.getCarts()
            .then((carts) => {
                const cart = carts.find(cart => cart.id === cartId);

                if (cart) {
                    return cart;
                } else {
                    console.log('Not found.');
                    throw new Error('Carrito inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    createCart () {
        return this.getCarts()
            .then((carts) => {

            const newCart = {
                id: carts[carts.length-1].id + 1,
                products: []
            };        

            fs.promises.writeFile(this.path, JSON.stringify([...carts, newCart], null, 2))
                .then(() => {
                    console.log('Carrito creado correctamente.');
                })
                .catch((err) => {
                    console.log('Error al crear el carrito.', err);
                    throw new Error('Error al crear el carrito.');
                })

            return newCart;
            }) 
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    updateCart (cartId, productId, quantity) {
        cartId = parseInt(cartId);
        productId = parseInt(productId);

        return productManager.getProductById(productId)
            .then (async (product) => {
                if (product.id) {
                    const carts = await this.getCarts();     
                    const cart = carts.find(cart => cart.id === cartId);
                    
                    if (cart) {
                        const cartProducts = cart.products
                        const productIndex = cartProducts.findIndex(product => product.productId === productId);

                        if (!(productIndex === -1)) {
                            const newData = {
                                productId: productId,
                                quantity: quantity
                            };

                            cartProducts.splice(productIndex, 1, newData);
                        } else {
                            const newProduct = {
                                productId: productId,
                                quantity: quantity
                            };
                            
                            cartProducts.push(newProduct);
                        }

                        fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                                .then(() => {
                                    console.log('Carrito actualizado correctamente.');
                                })
                                .catch((err) => {
                                    console.log('Error al actualizar el carrito.', err);
                                    throw new Error('Error al actualizar el carrito.');
                                })      
                    } else {
                        console.log('Not found.');
                        throw new Error('Carrito inexistente.');
                    } 

                    return cart;
                } else {
                    console.log('Not found.');
                    throw new Error('Producto inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    deleteCart (cartId) {
        cartId = parseInt(cartId);

        return this.getCarts()
            .then((carts) => {              
                const cartIndex = carts.findIndex(cart => cart.id === cartId);

                const deletedCart = carts[cartIndex];

                if (!(cartIndex === -1)) {
                    carts.splice(cartIndex, 1);

                    fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                        .then(() => {
                            console.log('Carrito eliminado correctamente.');
                        })
                        .catch((err) => {
                            console.log('Error al eliminar el carrito.', err);
                            throw new Error('Error al eliminar el carrito.');
                        })  
                    
                    return deletedCart;
                } else {
                    console.log('Not found.');
                    throw new Error('Carrito inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }

    deleteProductInCart (cartId, productId) {
        cartId = parseInt(cartId);
        productId = parseInt(productId);

        return this.getCarts()
            .then ((carts) => {
                const cart = carts.find(cart => cart.id === cartId);

                if (cart) {
                    const cartProducts = cart.products
                    const productIndex = cartProducts.findIndex(product => product.productId === productId);

                    const deletedProduct = cartProducts[productIndex];

                    if (!(productIndex === -1)) {
                        cartProducts.splice(productIndex, 1);

                        fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                            .then(() => {
                                console.log('Producto eliminado correctamente.');
                            })
                            .catch((err) => {
                                console.log('Error al eliminar el producto.', err);
                                throw new Error('Error al eliminar el producto.');
                            })
                        
                        return deletedProduct;
                    } else {
                        console.log('Not found.');
                        throw new Error('Producto inexistente.');
                    }
                } else {
                    console.log('Not found.');
                    throw new Error('Carrito inexistente.');
                }
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }
}

module.exports = CartManager;