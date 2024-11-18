const userImagesModel = require('./userImagesModel');
const isImage = require('../../validators/isImage');
const ApiError = require('../../error/ApiError');
const {validationResult} = require('express-validator');

class UserImagesController {
    async setImage(req, res, next) {
        try {
            const {id} = req.body;
            const files = req.files;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('id is invalid', errors.array()));
            }

            if (!isImage(files.image.name)) {
                return next(ApiError.badRequest('image is invalid'));
            }

            const data = await userImagesModel.setImage(files.image, id);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteImage(req, res, next) {
        try {
            const {id} = req.params;
            await userImagesModel.deleteImage(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UserImagesController();