const { Router } = require('express');
const userRouter = Router();
const UserController = require('../controllers/userController');
const userController = new UserController();
const UserMiddlewares = require('../middlewares/userMiddlewares');
const usersMiddlewares = new UserMiddlewares();

userRouter.get('/', 
    usersMiddlewares.authentication({strategy: 'jwt'}),
    usersMiddlewares.authorization('admin', 'user'),
    userController.getUsers.bind(userController)
);

userRouter.get('/:user', 
    usersMiddlewares.authentication({strategy: 'jwt'}),
    usersMiddlewares.authorization('admin', 'user'),
    userController.getUser.bind(userController)
);

userRouter.post('/', 
    usersMiddlewares.authentication({strategy: 'jwt'}),
    usersMiddlewares.authorization('admin', 'user'),
    userController.createUser.bind(userController)
);

userRouter.put('/:user', 
    usersMiddlewares.authentication({strategy: 'jwt'}),
    usersMiddlewares.authorization('admin', 'user'),
    userController.updateUser.bind(userController)
);

userRouter.delete('/:user', 
    usersMiddlewares.authentication({strategy: 'jwt'}),
    usersMiddlewares.authorization('admin'),
    userController.deleteUser.bind(userController)
);

module.exports = userRouter;