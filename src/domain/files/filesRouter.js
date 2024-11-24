const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const filesController = require('./filesController');
const {folderValidator, userIdValidator, renameValidator} = require('./validators/folderValidator');

const filesRouter = new Router();

filesRouter.get('/', authMiddleware, filesController.getFiles);
filesRouter.post('/folder', authMiddleware, ...folderValidator, filesController.createFolder);
filesRouter.post('/file', authMiddleware, userIdValidator, filesController.uploadFile);
filesRouter.put('/', authMiddleware, ...renameValidator, filesController.renameFile);
filesRouter.delete('/file/:id', authMiddleware, filesController.deleteFile);
filesRouter.delete('/folder/:id', authMiddleware, filesController.deleteFolder);

module.exports = filesRouter;