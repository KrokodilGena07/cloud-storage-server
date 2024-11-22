const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const userStoragesController = require('./userStoragesController');

const userStoragesRouter = new Router();

userStoragesRouter.get('/:userId', authMiddleware, userStoragesController.get);

module.exports = userStoragesRouter;