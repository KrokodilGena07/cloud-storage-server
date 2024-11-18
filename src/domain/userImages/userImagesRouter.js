const Router = require('express');
const userImagesController = require('./userImagesController');
const authMiddleware = require('../../middlewares/authMiddleware');
const userImagesValidator = require('./validators/userImageValidator');

const userImagesRouter = new Router();

userImagesRouter.put('/', authMiddleware, userImagesValidator, userImagesController.setImage);
userImagesRouter.delete('/:id', authMiddleware, userImagesController.deleteImage);

module.exports = userImagesRouter;