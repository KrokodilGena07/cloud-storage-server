const Router = require('express');
const activatedUsersController = require('./activatedUsersController');

const activatedUsersRouter = new Router();

activatedUsersRouter.get('/:id', activatedUsersController.checkUser);

module.exports = activatedUsersRouter;