const Router = require('express');
const userImagesController = require('./userImagesController');

const userImagesRouter = new Router();

userImagesRouter.put('/', userImagesController.setImage); //todo make validators
userImagesRouter.delete('/:id', userImagesController.deleteImage); //todo make validators

module.exports = userImagesRouter;