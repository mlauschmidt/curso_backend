const { Router } = require('express');
const productRouter = Router();

const ProductManager = require('../ProductManager');
const archivo = './products.json';
const manager = new ProductManager(archivo);

productRouter.get('/', async (req, res) => {
    const products = await manager.getProducts();
    const limit = req.query.limit;

    if (!limit) {
        return res.send(products);
    }
    
    const limitedProducts = products.slice(0,limit);

    return res.json(limitedProducts);
})

productRouter.get('/:pid', async (req, res) => {
    const product = await manager.getProductById(parseInt(req.params.pid));

    if (!product.id) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }
    
    return res.json(product);
})

productRouter.post('/', async (req, res) => {
    const data = req.body;
    const newProduct= await manager.createProduct(data);

    if (!newProduct.id) {
        return res.status(404).json({
            error: `Error al cargar el producto. ${newProduct}`
        });
    }

    return res.status(201).json(newProduct);
})

productRouter.put('/:pid', async (req, res) => {
    const newData = req.body;
    const updatedProduct = await manager.updateProduct(parseInt(req.params.pid), newData);

    if (!updatedProduct) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }

    return res.json(updatedProduct);
})

productRouter.delete('/:pid', async (req, res) => {
    const product = await manager.deleteProduct (parseInt(req.params.pid));

    if (!product) {
        return res.status(404).json({
            error: 'Product not found'
        });
    }
    
    return res.status(204).json({});
})

module.exports = productRouter;
