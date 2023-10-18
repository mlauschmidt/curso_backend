const { Router } = require('express');
const userRouter = Router();
const UserController = require('../controllers/userController');
const userController = new UserController();

userRouter.get('/', userController.getUsers.bind(userController));

userRouter.get('/:user', userController.getUser.bind(userController));

userRouter.post('/', userController.createUser.bind(userController));

userRouter.put('/:user', userController.updateUser.bind(userController));

userRouter.delete('/:user', userController.deleteUser.bind(userController));

module.exports = userRouter;