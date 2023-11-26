const { Router } = require('express');
const sessionRouter = Router();
const userModel = require('../DAO/mongo/models/user.model');
const { createHash } = require('../../utils/passwordHash');
const UserMiddlewares = require('../../middlewares/userMiddlewares');
const usersMiddlewares = new UserMiddlewares();

sessionRouter.get('/current', 
    usersMiddlewares.authentication({strategy: 'jwt'}),  
    (req, res) => {
        const user = req.user;
        
        if (user) {
            /* console.log({userGet: user}); */
            return res.json(user);
        } else {
            return res.json({});
        }
    }
)

sessionRouter.post('/register', usersMiddlewares.authentication({strategy: 'register'}, '/register'), async (req, res) => {
    return res.redirect('/login');
})

sessionRouter.post('/login', usersMiddlewares.authentication({strategy:'login'}, '/login'), async (req, res) => {
    const token = req.user;

    return res.cookie('authTokenCookie', token, {
        maxAge: 60*60*1000,
        signed: true,
        httpOnly: true
    }).send({message: 'Logged in.'});
})

sessionRouter.get('/logout', (req, res) => {
    return res.clearCookie('authTokenCookie').send('Cookie removed');
})

sessionRouter.get('/github', usersMiddlewares.authentication({strategy: 'github', options: {scope: ['user: email']}}), async (req, res) => {

})

sessionRouter.get('/github-callback', usersMiddlewares.authentication({strategy: 'github'}, '/login'), async (req, res) => {
    const token = req.user;

    return res.cookie('authTokenCookie', token, {
        maxAge: 60*60*1000,
        signed: true,
        httpOnly: true
    }).redirect(`/github-data`);
})

sessionRouter.post('/recovery-password', async (req, res) => {
    const username = req.body.username;
    let user = await userModel.findOne({ "$or": [{username: username}, {email: username}]});
  
    if (!user) {
        return res.status(401).json({
            error: 'El usuario no existe en el sistema.'
        })
    }
  
    const newPassword = createHash(req.body.password);
    await userModel.updateOne({ email: user.email }, { password: newPassword });
  
    return res.redirect('/login');
})

module.exports = sessionRouter;

//DIVIDIR ESTE ARCHIVO EN SESSION CONTROLLER PARA LA LOGICA, VINCULANDOLO AL USER SERVICE PARA EL RECOVERY PASSWORD, Y SESSION ROUTER. 

//HACER LO MISMO CON EL VIEWS ROUTER