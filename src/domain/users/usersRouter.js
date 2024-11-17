const Router = require('express');
const usersController = require('./usersController');
const userPasswordValidator = require('./validators/userPasswordValidator');
const userValidator = require('../../validators/userValidator');
const authMiddleware = require('../../middlewares/authMiddleware');

const usersRouter = new Router();

usersRouter.get('/', authMiddleware, usersController.checkUserPassword);
usersRouter.put('/', authMiddleware, ...userValidator, usersController.updateUser);
usersRouter.put('/password', authMiddleware, ...userPasswordValidator, usersController.updateUserPassword);
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser);

module.exports = usersRouter;