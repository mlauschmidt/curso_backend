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
                return [];
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
                        id: products.length + 1,
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
                                console.log('Producto agregado correctamente');
                            })
                            .catch((err) => {
                                console.log('Error al agregar producto');
                            })

                        return newProduct;
                    } else {
                        console.log(`Ya existe un producto con el código ${data.code}`);
                        return `Ya existe un producto con el código ${data.code}`;
                    }
                }) 
                .catch((err) => {
                    console.log('Error al leer el archivo');
                })
        } else {
            console.log(`Todos los campos son obligatorios`); 
        }
    }

    getProductById (productId) {
        return this.getProducts()
            .then((products) => {
                const findProduct = products.find(product => product.id === productId);

                if (findProduct) {
                    return findProduct;
                } else {
                    console.log(`Not found`);
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

    updateProduct (productId, data) {
        return this.getProducts()
            .then((products) => {       
                const product = products.find(product => product.id === productId);

                if (product) {
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

                    products.splice(product.id-1, 1, newData);

                    fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                        .then(() => {
                            console.log('Producto actualizado correctamente');
                        })
                        .catch((err) => {
                            console.log('Error al actualizar producto');
                        })
                    
                    return newData;
                } else {
                    console.log(`Not found`);
                }
            })
            .catch((err) => {
                console.log('Error al leer el archivo');
            })
    }

    deleteProduct (productId) {
        return this.getProducts()
            .then((products) => {              
                const productIndex = products.findIndex(product => product.id === productId);

                if (!(productIndex === -1)) {
                    products.splice(productIndex, 1);

                    fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                        .then(() => {
                            console.log('Producto eliminado correctamente');
                        })
                        .catch((err) => {
                            console.log('Error al eliminar producto');
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
}

module.exports = ProductManager;