const fs = require('fs');

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

    createCart (data) {
        return this.getCarts()
            .then((carts) => {

            const newCart = {
                id: carts.length + 1,
                products: data
            };        

            fs.promises.writeFile(this.path, JSON.stringify([...carts, newCart], null, 2))
                .then(() => {
                    console.log('Producto agregado correctamente');
                })
                .catch((err) => {
                    console.log('Error al agregar producto');
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
        return this.getCarts()
            .then((carts) => {     
                const findCart = carts.find(cart => cart.id === cartId);

                if (findCart) {
                    const products = findCart.products
                    const product = products.findIndex(product => product.productId === productId);

                    if (!(product === -1)) {
                        const newData = {
                            productId: productId,
                            quantity: products[product].quantity + newQty.quantity
                        };

                        products.splice(product, 1, newData);
                    } else {
                        const newProduct = {
                            productId: productId,
                            quantity: newQty.quantity
                        };
                        
                        products.push(newProduct);
                    }

                    fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2))
                            .then(() => {
                                console.log('Producto actualizado correctamente');
                            })
                            .catch((err) => {
                                console.log('Error al actualizar producto');
                            })
                        
                    return 'ok';
                } else {
                    console.log(`Not found`);
                    return 'Carrito inexistente'
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

}

module.exports = CartManager;