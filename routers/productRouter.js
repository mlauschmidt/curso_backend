const { Router } = require('express');
const productRouter = Router();
const ProductManager = require('../dao/mongooseProductManager');
const productManager = new ProductManager('./products.json');

const productRouterFn = (io) => {
    productRouter.get('/', async (req, res) => {
        try {
            const limit = req.query.limit;
            const products = await productManager.getProducts();

            if (!limit) {
                return res.send(products);
            }
            
            const limitedProducts = products.slice(0,limit);
        
            return res.json(limitedProducts);
        } catch (err) {
            return res.status(404).json({
                error: err
            });
        }
    })
    
    productRouter.get('/:pid', async (req, res) => {
        try {
            const product = await productManager.getProductById(req.params.pid);
                       
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
            const newData = req.body;
            const updatedProduct = await productManager.updateProduct(req.params.pid, newData);

            io.emit('producto_modificado', JSON.stringify(updatedProduct));
    
            return res.json(updatedProduct);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    })
    
    productRouter.delete('/:pid', async (req, res) => {
        try {
            const product = await productManager.deleteProduct (req.params.pid);

            io.emit('producto_eliminado', JSON.stringify(product));

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
