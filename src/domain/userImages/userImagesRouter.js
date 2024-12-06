const Router = require('express');
const userImagesController = require('./userImagesController');
const authMiddleware = require('../../middlewares/authMiddleware');
const fieldValidator = require('../../validators/fieldValidator');

const userImagesRouter = new Router();

userImagesRouter.put('/', authMiddleware, fieldValidator('id'), userImagesController.setImage);
userImagesRouter.delete('/:id', authMiddleware, userImagesController.deleteImage);

module.exports = userImagesRouter;