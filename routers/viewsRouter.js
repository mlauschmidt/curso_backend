const { Router } = require('express');
const viewsRouter = Router();
const ProductManager = require('../dao/mongooseProductManager');
const productManager = new ProductManager('./products.json');
const messageModel = require('../dao/models/message.model');

viewsRouter.get('/home', async (req, res) => {
    const products = await productManager.getProducts();
    
    const params = {
        title: 'Inicio',
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

viewsRouter.get('/login', (req, res) => {
    return res.render('login', {title: 'Inicio de sesión'});
})

viewsRouter.post('/login', async (req, res) => {
    const user = req.body.user;

    return res.redirect(`/chat?username=${user}`);
})

viewsRouter.get('/chat', (req, res) => {
    return res.render('chat', {title: 'Chat'});
})

module.exports = viewsRouter;