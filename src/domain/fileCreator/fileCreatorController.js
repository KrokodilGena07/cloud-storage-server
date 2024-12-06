const {validationResult} = require('express-validator');
const ApiError = require('../../error/ApiError');
const fileCreatorModel = require('./fileCreatorModel');
const ErrorTextList = require('../../error/ErrorTextList');

class FileCreatorController {
    async createFolder(req, res, next) {
        try {
            const {name, folderId, userId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            const data = await fileCreatorModel.createFolder(name, folderId, userId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async uploadFile(req, res, next) {
        try {
            const {userId, folderId} = req.body;
            const files = req.files;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            if (!files?.file) {
                return next(ApiError.badRequest(ErrorTextList.EMPTY_FILE_ERROR));
            }

            const data = await fileCreatorModel.uploadFile(files.file, userId, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FileCreatorController();