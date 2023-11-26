const { productService } = require('../services/index');

class ProductController {
    constructor () {
        this.service = productService;
    }

    async getProducts (req, res) {
        try {
            const limit = req.query.limit || 10;
            const page = req.query.page || 1;
            const sort = req.query.sort;
            const query = req.query.query;
            const products = await this.service.getProducts(limit, page, sort, query);
            
            return res.json(products);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
     
    async getProductById (req, res) {
        try {
            const prodId = req.params.pid;
            const product = await this.service.getProductById(prodId);
            
            return res.json(product);    
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async createProduct (req, res, io) {
        try {
            const data = req.body;
            const newProduct= await this.service.createProduct(data);
            
            io.emit('producto_agregado_inventario', JSON.stringify(newProduct));
    
            return res.status(201).json(newProduct);
        } catch (err) {
            return res.status(400).json({
                error: err.message
            });
        } 
    }
  
    async updateProduct (req, res, io) {
        try { 
            const prodId = req.params.pid;
            const newData = req.body;
            const updatedProduct = await this.service.updateProduct(prodId, newData);
            
            io.emit('producto_modificado_inventario', JSON.stringify(updatedProduct));
    
            return res.status(200).json(updatedProduct);
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }
    }
  
    async deleteProduct (req, res, io) {
        try {
            const prodId = req.params.pid;
            const product = await this.service.deleteProduct(prodId);

            io.emit('producto_eliminado_inventario', JSON.stringify(product));

            return res.status(204).json({});
        } catch (err) {
            return res.status(404).json({
                error: err.message
            });
        }    
    }
}

module.exports = ProductController;