const Router = require('express');
const authMiddleware = require('../../middlewares/authMiddleware');
const fileReaderController = require('./fileReaderController');

const fileReaderRouter = new Router();

fileReaderRouter.get('/', authMiddleware, fileReaderController.getFiles);
fileReaderRouter.get('/search', authMiddleware, fileReaderController.searchFiles);
fileReaderRouter.get('/:id', authMiddleware, fileReaderController.download);

module.exports = fileReaderRouter;