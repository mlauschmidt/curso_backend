const { Router } = require('express');
const productRouter = Router();
const ProductController = require('../controllers/productController');
const productController = new ProductController();

const productRouterFn = (io) => {
    productRouter.get('/', productController.getProducts.bind(productController));

    productRouter.get('/:pid', productController.getProductById.bind(productController));

    productRouter.post('/', (req, res, next) => {
        productController.createProduct(req, res, io);
    });

    productRouter.put('/:pid', (req, res, next) => {
        productController.updateProduct(req, res, io);
    });

    productRouter.delete('/:pid', productController.deleteProduct.bind(productController));

    return productRouter;
}

module.exports = productRouterFn;