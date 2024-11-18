const Router = require('express');
const usersController = require('./usersController');
const authMiddleware = require('../../middlewares/authMiddleware');
const userValidator = require('./validators/userValidator');

const usersRouter = new Router();

usersRouter.put('/', authMiddleware, ...userValidator, usersController.updateUser);
usersRouter.delete('/:id', authMiddleware, usersController.deleteUser);

module.exports = usersRouter;