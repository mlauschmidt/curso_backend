const express = require('express');
const DB = require('./db/singleton');
const socketServer = require('./utils/io');
const handlebars = require('express-handlebars');
const viewsRouter = require('./routers/viewsRouter');
const userRouter = require('./routers/userRouter');
const sessionRouter = require('./routers/sessionRouter');
const productRouterFn = require('./routers/productRouter');
const cartRouterFn = require('./routers/cartRouter');
const passport = require('passport');
const initializePassport = require('./utils/passport/passport.config');
const {Command} = require('commander');
const dotenv = require('dotenv');
const configFn = require('./utils/config');

//Configuracion argumentos
const program = new Command();
program.option('--mode <mode>', 'Modo de trabajo', 'dev');
program.parse();
const options = program.opts();
console.log(options);

//Configuracion variables de entorno
dotenv.config({
    path: `./.env.${options.mode}`
});
const settings = configFn();

//Configuracion express
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('view/public'));

//Configuracion base de datos
const dbConnection = DB.getConnection(settings);

//Configuracion passport
initializePassport();
app.use(passport.initialize());

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