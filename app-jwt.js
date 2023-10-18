const express = require('express');
const mongoose = require('mongoose');
const socketServer = require('./utils/io');
const handlebars = require('express-handlebars');
const viewsRouter = require('./routers/viewsRouter');
const userRouter = require('./routers/userRouter');
const sessionRouter = require('./routers/sessionRouter');
const productRouterFn = require('./routers/productRouter');
const cartRouterFn = require('./routers/cartRouter');
const passport = require('passport');
const initializePassport = require('./utils/config/passport.config');

//Configuracion express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('view/public'));

//Configuracion base de datos
const MONGODB_CONNECT = 'mongodb+srv://mlauraschmidt:d3Ep0z6YNqHNFK2d@cluster0.xj9o7mz.mongodb.net/ecommerce?retryWrites=true&w=majority'
mongoose.connect(MONGODB_CONNECT)
    .catch(e => {
        console.log('No se pudo conectar a la base de datos.', e);
        process.exit();
    })

//Configuracion passport
initializePassport();
app.use(passport.initialize());
/* app.use(passport.session()); */ 

//Configuracion websockets
const httpServer = app.listen(8080, () => {
    console.log('Servidor express escuchando en el puerto 8080');
})

const io = socketServer(httpServer);

//Configuracion handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', './view/views');
app.set('view engine', 'handlebars');

//Configuracion routers
app.use('/', viewsRouter);
app.use('/api/users', userRouter);
app.use('/api/sessions', sessionRouter);
const productRouter = productRouterFn(io);
app.use('/api/products', productRouter);
const cartRouter = cartRouterFn(io);
app.use('/api/carts', cartRouter);

//FALTA TERMINAR DE REVISAR ESTE ARCHIVO POR SI HAY QUE HACER ALGUN CAMBIO, EN LAS ESTRATEGIAS, Y PRINCIPALMENTE EN EL ENDPOINT DE PROFILE