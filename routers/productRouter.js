const { Router } = require('express');
const productRouter = Router();
const ProductController = require('../controllers/productController');
const productController = new ProductController();
const UserMiddlewares = require('../middlewares/userMiddlewares');
const usersMiddlewares = new UserMiddlewares();

const productRouterFn = (io) => {
    productRouter.get('/', 
        usersMiddlewares.authentication({strategy: 'jwt'}),
        usersMiddlewares.authorization('admin', 'user'), 
        productController.getProducts.bind(productController)
    );

    productRouter.get('/:pid', 
        usersMiddlewares.authentication({strategy: 'jwt'}),
        usersMiddlewares.authorization('admin', 'user'),
        productController.getProductById.bind(productController)
    );

    productRouter.post('/', 
        usersMiddlewares.authentication({strategy: 'jwt'}),
        usersMiddlewares.authorization('admin'),
        (req, res, next) => {
            productController.createProduct(req, res, io);
        }
    );

    productRouter.put('/:pid', 
        usersMiddlewares.authentication({strategy: 'jwt'}),
        usersMiddlewares.authorization('admin'),
        (req, res, next) => {
            productController.updateProduct(req, res, io);
        }
    );

    productRouter.delete('/:pid', 
        usersMiddlewares.authentication({strategy: 'jwt'}),
        usersMiddlewares.authorization('admin'),
        (req, res, next) => {
            productController.deleteProduct(req, res, io);
        }
    );

    return productRouter;
}

module.exports = productRouterFn;