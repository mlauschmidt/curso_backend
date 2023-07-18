const express = require('express');
const handlebars = require('express-handlebars');
const socketServer = require('./utils/io');
const viewsRouter = require('./routers/viewsRouter');
const productRouterFn = require('./routers/productRouter');
const cartRouter = require('./routers/cartRouter');

//Configuracion express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//Configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './views');
app.set('view engine', 'handlebars');

//Configuracion websockets
const httpServer = app.listen(8080, () => {
    console.log('Servidor express escuchando en el puerto 8080');
})

const io = socketServer(httpServer);

//Configuracion routers
app.use('/', viewsRouter);
const productRouter = productRouterFn(io);
app.use('/api/products', productRouter);
app.use('/api/carts', cartRouter);

