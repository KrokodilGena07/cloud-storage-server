const Router = require('express');
const trashController = require('./trashController');
const authMiddleware = require('../../middlewares/authMiddleware');

const trashRouter = new Router();

trashRouter.get('/:userId', authMiddleware, trashController.get);
trashRouter.put('/one/:fileId', authMiddleware, trashController.addOne);
trashRouter.put('/many/:list', authMiddleware, trashController.addMany);
trashRouter.delete('/restore/one/:id', authMiddleware, trashController.restoreOne);
trashRouter.delete('/restore/many/:list', authMiddleware, trashController.restoreMany);
trashRouter.delete('/:userId', authMiddleware, trashController.clear);

module.exports = trashRouter;