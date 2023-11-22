const ProductDTO = require('../DAO/DTO/productDTO');

class ProductService {
    constructor (dao) {
        this.dao = dao;
    }
  
    async getProducts (limit, page, sortParam, queryParam) {
        let products = await this.dao.getProducts(limit, page, sortParam, queryParam);
        const productsDTO = products.payload.map(prod => new ProductDTO(prod));
        products = {...products, payload: productsDTO};

        return products;
    }
  
    async getProductById (productId) {
        const product = await this.dao.getProductById(productId);
        const productDTO = new ProductDTO(product);

        return productDTO;
    }
  
    async createProduct (data) {
        const newProduct = await this.dao.createProduct(data);
        const productDTO = new ProductDTO(newProduct);

        return productDTO;
    }
  
    async updateProduct (productId, data) {
        const updatedProduct = await this.dao.updateProduct(productId, data);
        const productDTO = new ProductDTO(updatedProduct);

        return productDTO;
    }
  
    async deleteProduct (productId) {
        const product = await this.dao.deleteProduct(productId);
        const productDTO = new ProductDTO(product);

        return productDTO;
    }
}

module.exports = ProductService;