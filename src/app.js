const ProductManager = require('./ProductManager');
const archivo = './products.json';
const manager = new ProductManager(archivo);

const express = require('express');
const app = express();

app.get('/products', async (req, res) => {
    const products = await manager.getProducts();
    const limit = req.query.limit;

    if (!limit) {
        return res.send(products);
    }
    
    const limitedProducts = products.slice(0,limit);

    return res.send(limitedProducts);
})

app.get('/products/:pid', async (req, res) => {
    const product = await manager.getProductById(parseInt(req.params.pid));

    if (!product) {
        return res.send(`Producto con Id:${req.params.pid} no encontrado`);
    }
    
    return res.send(product);
})

app.listen(8080, () => {
    console.log('Servidor express escuchando en el puerto 8080');
})