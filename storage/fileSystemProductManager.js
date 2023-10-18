const fs = require('fs');

class ProductManager {
    constructor (path) {
        this.path = path;
    }

    getProducts () {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((contenidoArchivo) => {
                const products = JSON.parse(contenidoArchivo); 
                return products;
            })
            .catch((err) => {
                console.log('No se pudo acceder a la base de datos.', err);
                throw new Error('No se pudo acceder a la base de datos.');
            })
    }

    getProductById (productId) {
        productId = parseInt(productId);

        return this.getProducts()
            .then((products) => {
                const product = products.find(product => product.id === productId);

                if (product) {
                    return product;
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

    createProduct (data) {
        if (data.title 
            && data.description
            && data.price
            && data.code
            && data.stock
            && data.category ) {

            return this.getProducts()
                .then((products) => {

                    const newProduct = {
                        id: products[products.length-1].id + 1,
                        title: data.title,
                        description: data.description,
                        price: data.price,
                        thumbnail: data.thumbnail,
                        code: data.code,
                        stock: data.stock ?? "Sin stock",
                        status: true,
                        category: data.category
                    };        

                    const productExists = products.findIndex(product => product.code === data.code);

                    if (productExists === -1) {
                        fs.promises.writeFile(this.path, JSON.stringify([...products, newProduct], null, 2))
                            .then(() => {
                                console.log('Producto agregado correctamente.');
                            })
                            .catch((err) => {
                                console.log('Error al agregar el nuevo producto.', err);
                                throw new Error('Error al agregar el nuevo producto.');
                            })

                        return newProduct;
                    } else {
                        console.log(`Ya existe un producto con el código ${data.code}.`);
                        throw new Error(`Ya existe un producto con el código ${data.code}.`);
                    }
                }) 
                .catch((err) => {
                    console.log(err);
                    throw new Error(err);
                })
        } else {
            console.log('Todos los campos son obligatorios.'); 
            throw new Error('Todos los campos son obligatorios.'); 
        }
    }

    updateProduct (productId, data) {
        productId = parseInt(productId);

        return this.getProducts()
            .then((products) => {       
                const productIndex = products.findIndex(product => product.id === productId);

                const product = products[productIndex];

                if (!(productIndex === -1)) {
                    const newData = {
                        id: product.id,
                        title: data.title ?? product.title,
                        description: data.description ?? product.description,
                        price: data.price ?? product.price,
                        thumbnail: data.thumbnail ?? product.thumbnail,
                        code: data.code ?? product.code,
                        stock: data.stock ?? product.stock,
                        status: data.status ?? product.status,
                        category: data.category ?? product.category
                    };

                    products.splice(productIndex, 1, newData);

                    fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                        .then(() => {
                            console.log('Producto actualizado correctamente.');
                        })
                        .catch((err) => {
                            console.log('Error al actualizar el producto.', err);
                            throw new Error('Error al actualizar el producto.');
                        })
                    
                    return newData;
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

    deleteProduct (productId) {
        productId = parseInt(productId);

        return this.getProducts()
            .then((products) => {              
                const productIndex = products.findIndex(product => product.id === productId);
                
                const deletedProduct = products[productIndex];

                if (!(productIndex === -1)) {
                    products.splice(productIndex, 1);

                    fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
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
            })
            .catch((err) => {
                console.log(err);
                throw new Error(err);
            })
    }
}

module.exports = ProductManager;