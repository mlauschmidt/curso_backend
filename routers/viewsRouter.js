const { Router } = require('express');
const viewsRouter = Router();
const ProductManager = require('../managers/ProductManager');
const productManager = new ProductManager('./products.json');

viewsRouter.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    
    const params = {
        title: 'Home',
        products
    }

    return res.render('home', params);
})

viewsRouter.get('/realtimeproducts', async (req, res) => {    
    const products = await productManager.getProducts();

    const params = {
        title: 'Productos en tiempo real',
        products
    }

    return res.render('realTimeProducts', params);
})

module.exports = viewsRouter;