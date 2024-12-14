const {validationResult} = require('express-validator');
const ApiError = require('../../error/ApiError');
const fileUpdaterModel = require('./fileUpdaterModel');
const ErrorTextList = require('../../error/ErrorTextList');
const jsonValidator = require('../../validators/jsonValidator');

class FileUpdaterController {
    async rename(req, res, next) {
        try {
            const {id, name, folderId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            const data = await fileUpdaterModel.rename(id, name, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async replaceOne(req, res, next) {
        try {
            const {id, folderId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            const data = await fileUpdaterModel.replaceOne(id, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async replaceMany(req, res, next) {
        try {
            const {list, folderId} = req.body;

            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            await fileUpdaterModel.replaceMany(
                list.filter(item => typeof item === 'string'),
                folderId
            );
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FileUpdaterController();