const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const fileUpdaterController = require('./fileUpdaterController');
const idValidator = require('../../validators/idValidator');
const updateValidator = require('./validators/updateValidator');

const fileUpdaterRouter = new Router();

fileUpdaterRouter.put('/rename', authMiddleware, ...updateValidator, fileUpdaterController.rename);
fileUpdaterRouter.put('/replace/one', authMiddleware, idValidator('id'), fileUpdaterController.replaceOne);
fileUpdaterRouter.put('/replace/many', authMiddleware, fileUpdaterController.replaceMany);

module.exports = fileUpdaterRouter;