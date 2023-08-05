const fs = require('fs');

const ProductManager = require('./mongooseProductManager');
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
                return [];
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
                    console.log('Carrito creado correctamente');
                })
                .catch((err) => {
                    console.log('Error al crear el carrito');
                })

            return newCart;
            }) 
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

    getCartById (cartId) {
        return this.getCarts()
            .then((carts) => {
                const findCart = carts.find(cart => cart.id === cartId);

                if (findCart) {
                    return findCart.products;
                } else {
                    console.log(`Not found`);
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

    updateCart (cartId, productId, newQty) {
        return productManager.getProductById(productId)
            .then (async (product) => {
                if (product.id) {
                    const carts = await this.getCarts();     
                    const findCart = carts.find(cart => cart.id === cartId);
                    
                    if (findCart) {
                        const cartProducts = findCart.products
                        const productIndex = cartProducts.findIndex(product => product.productId === productId);

                        if (!(productIndex === -1)) {
                            const newData = {
                                productId: productId,
                                quantity: cartProducts[productIndex].quantity + newQty.quantity
                            };

                            cartProducts.splice(productIndex, 1, newData);
                        } else {
                            const newProduct = {
                                productId: productId,
                                quantity: newQty.quantity
                            };
                            
                            cartProducts.push(newProduct);
                        }

                        fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                                .then(() => {
                                    console.log('Producto agregado correctamente');
                                })
                                .catch((err) => {
                                    console.log('Error al agregar el producto');
                                })      
                    } else {
                        console.log(`Cart not found`);
                        return 'Carrito inexistente'
                    } 

                    return findCart;
                } else {
                    console.log(`Product not found`);
                    return 'Producto inexistente'
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo123');
            })
    }

    deleteCart (cartId) {
        return this.getCarts()
            .then((carts) => {              
                const cartIndex = carts.findIndex(cart => cart.id === cartId);

                if (!(cartIndex === -1)) {
                    carts.splice(cartIndex, 1);

                    fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                        .then(() => {
                            console.log('Carrito eliminado correctamente');
                        })
                        .catch((err) => {
                            console.log('Error al eliminar carrito');
                        })  
                    
                    return {};
                } else {
                    console.log(`Not found`);
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

    deleteProductInCart (cartId, productId) {
        return this.getCarts()
            .then ((carts) => {
                const findCart = carts.find(cart => cart.id === cartId);

                if (findCart) {
                    const cartProducts = findCart.products
                    const productIndex = cartProducts.findIndex(product => product.productId === productId);

                    if (!(productIndex === -1)) {
                        cartProducts.splice(productIndex, 1);

                        fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                            .then(() => {
                                console.log('Producto eliminado correctamente');
                            })
                            .catch((err) => {
                                console.log('Error al eliminar el producto');
                            })
                        
                        return {};
                    } 
                } else {
                    console.log(`Not found`);
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }
}

module.exports = CartManager;