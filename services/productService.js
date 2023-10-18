const ProductManager = require('../storage/productManager');

class ProductService {
    constructor () {
        this.storage = new ProductManager();
    }
  
    getProducts (limit, page, sortParam, queryParam) {
        return this.storage.getProducts(limit, page, sortParam, queryParam);
    }
  
    getProductById (productId) {
        return this.storage.getProductById(productId);
    }
  
    createProduct (data) {
        return this.storage.createProduct(data);
    }
  
    updateProduct (productId, data) {
        return this.storage.updateProduct(productId, data);
    }
  
    deleteProduct (productId) {
        return this.storage.deleteProduct(productId);
    }
}

module.exports = ProductService;