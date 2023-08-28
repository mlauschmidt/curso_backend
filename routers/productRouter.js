const { Router } = require('express');
const productRouter = Router();
/* const ProductManager = require('../dao/fileSystemProductManager'); */
const ProductManager = require('../dao/mongooseProductManager');
const productManager = new ProductManager('./products.json');

const productRouterFn = (io) => {
    productRouter.get('/', async (req, res) => {
        try {
            const limit = req.query.limit || 10;
            const page = req.query.page || 1;
            const sort = req.query.sort;
            const query = req.query.query;
            let products = await productManager.getProducts(limit, page, sort, query);

            return res.json(products);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })
    
    productRouter.get('/:pid', async (req, res) => {
        try {
            const prodId = req.params.pid;
            const product = await productManager.getProductById(prodId);
                       
            return res.json(product);    
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })
    
    productRouter.post('/', async (req, res) => {
        try {
            const data = req.body;
            const newProduct= await productManager.createProduct(data);

            io.emit('nuevo_producto', JSON.stringify(newProduct));
    
            return res.status(201).json(newProduct);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        } 
    })
    
    productRouter.put('/:pid', async (req, res) => {
        try { 
            const prodId = req.params.pid;
            const newData = req.body;
            const updatedProduct = await productManager.updateProduct(prodId, newData);

            io.emit('producto_modificado', JSON.stringify(updatedProduct));
    
            return res.status(200).json(updatedProduct);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })
    
    productRouter.delete('/:pid', async (req, res) => {
        try {
            const prodId = req.params.pid;
            const product = await productManager.deleteProduct(prodId);

            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }        
    })

    return productRouter;
}

module.exports = productRouterFn;
