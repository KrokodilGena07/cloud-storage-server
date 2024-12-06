const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const fileCreatorController = require('./fileCreatorController');
const fieldValidator = require('../../validators/fieldValidator');
const createValidator = require('./validators/createValidator');

const fileCreatorRouter = new Router();

fileCreatorRouter.post('/folder', authMiddleware, ...createValidator, fileCreatorController.createFolder);
fileCreatorRouter.post('/file', authMiddleware, fieldValidator('userId'), fileCreatorController.uploadFile);

module.exports = fileCreatorRouter;