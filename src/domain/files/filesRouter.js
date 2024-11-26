const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const filesController = require('./filesController');
const {folderValidator, userIdValidator, renameValidator, idValidator} = require('./validators/folderValidator');

const filesRouter = new Router();

filesRouter.get('/', authMiddleware, filesController.getFiles);
filesRouter.get('/search', authMiddleware, filesController.searchFiles);
filesRouter.post('/folder', authMiddleware, ...folderValidator, filesController.createFolder);
filesRouter.post('/file', authMiddleware, userIdValidator, filesController.uploadFile);
filesRouter.put('/', authMiddleware, ...renameValidator, filesController.renameFile);
filesRouter.put('/replace', authMiddleware, idValidator, filesController.replaceFile);
filesRouter.delete('/:id', authMiddleware, filesController.deleteItem);

module.exports = filesRouter;