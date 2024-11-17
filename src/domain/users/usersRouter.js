const Router = require('express');
const usersController = require('./usersController');
const userPasswordValidator = require('./validators/userPasswordValidator');
const userValidator = require('../../validators/userValidator');

const usersRouter = new Router();

usersRouter.get('/', usersController.checkUserPassword);
usersRouter.put('/', ...userValidator, usersController.updateUser);
usersRouter.put('/password', ...userPasswordValidator, usersController.updateUserPassword);
usersRouter.delete('/:id', usersController.deleteUser);

module.exports = usersRouter;