const productModel = require('./models/product.model');

class ProductManager {
    constructor () {
        this.model = productModel;
    }

    async getProducts () {
        const products = await this.model.find().lean();

        if (products) {
            return products;
        } else {
            console.log('No se pudo acceder a la base de datos.');
            throw new Error('No se pudo acceder a la base de datos.');
        }
    }

    async getProductById (productId) {
        const product = await this.model.findById(productId);

        if (product) {
            return product;
        } else {
            console.log('Not found.');
            throw new Error('Producto inexistente.');
        }
    }

    async createProduct (data) {
        if (data.title 
            && data.description
            && data.price
            && data.code
            && data.stock
            && data.category ) {

            const products = await this.getProducts()

            if (products) {
                const newProduct = {
                    /* id: products[products.length-1].id + 1, */
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
                    try {
                        const productCreated = await this.model.create(newProduct);

                        console.log('Producto agregado correctamente');

                        return productCreated;
                    } catch (err) {
                        console.log('Error al agregar el nuevo producto', err);
                        throw new Error('Error al agregar el nuevo producto');
                    }
                } else {
                    console.log(`Ya existe un producto con el código ${data.code}`);
                    throw new Error(`Ya existe un producto con el código ${data.code}`);
                }
            } else {
                console.log('No se pudo acceder a la base de datos.');
                throw new Error('No se pudo acceder a la base de datos.');
            }
        } else {
            console.log('Todos los campos son obligatorios'); 
            throw new Error('Todos los campos son obligatorios');
        }
    }

    async updateProduct (productId, data) {
        const product = await this.getProductById(productId)

        if (product) {
            const updatedProduct = {
                _id: product._id,
                title: data.title ?? product.title,
                description: data.description ?? product.description,
                price: data.price ?? product.price,
                thumbnail: data.thumbnail ?? product.thumbnail,
                code: data.code ?? product.code,
                stock: data.stock ?? product.stock,
                status: data.status ?? product.status,
                category: data.category ?? product.category
            };          
            
            try {
                await this.model.updateOne({_id: productId}, updatedProduct);

                console.log('Producto actualizado correctamente');

                return updatedProduct;
            } catch (err) {
                console.log('Error al actualizar el producto', err);
                throw new Error('Error al actualizar el producto');
            }
        } else {
            console.log('Not found.');
            throw new Error('Producto inexistente.');
        }
    }

    async deleteProduct (productId) {
        const product = await this.getProductById(productId)

        if (product) {
            try {
                await this.model.deleteOne({_id: productId});
    
                console.log('Producto eliminado correctamente');

                return true;
            } catch (err) {
                console.log('Error al eliminar el producto', err);
                throw new Error('Error al actualizar el producto');
            }
        } else {
            console.log('Not found.');
            throw new Error('Producto inexistente.');
        }
    }
}

module.exports = ProductManager;