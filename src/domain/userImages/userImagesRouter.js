const Router = require('express');
const userImagesController = require('./userImagesController');
const authMiddleware = require('../../middlewares/authMiddleware');
const idValidator = require('../../validators/idValidator');

const userImagesRouter = new Router();

userImagesRouter.put('/', authMiddleware, idValidator('id'), userImagesController.setImage);
userImagesRouter.delete('/:id', authMiddleware, userImagesController.deleteImage);

module.exports = userImagesRouter;