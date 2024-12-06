const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const fileDeleterController = require('./fileDeleterController');

const fileDeleterRouter = new Router();

fileDeleterRouter.delete('/one/:id', authMiddleware, fileDeleterController.deleteOne);
fileDeleterRouter.delete('/many/:list', authMiddleware, fileDeleterController.deleteMany);

module.exports = fileDeleterRouter;