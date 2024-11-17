const Router = require('express');
const usersController = require('./usersController');

const usersRouter = new Router();

usersRouter.put('/', usersController.updateUser); //todo make validators
usersRouter.put('/password', usersController.updateUserPassword); //todo make validators
usersRouter.delete('/:id', usersController.deleteUser); //todo make validators

module.exports = usersRouter;