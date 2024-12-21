const trashModel = require('./trashModel');
const jsonValidator = require('../../validators/jsonValidator');
const ErrorTextList = require('../../error/ErrorTextList');
const ApiError = require('../../error/ApiError');

class TrashController {
    async get(req, res, next) {
        try {
            const {userId} = req.params;
            const data = await trashModel.get(userId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async addOne(req, res, next) {
        try {
            const {fileId} = req.params;
            const data = await trashModel.addOne(fileId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async addMany(req, res, next) {
        try {
            const {list} = req.params;

            const array = jsonValidator(list, ErrorTextList.INVALID_DATA);
            if (!Array.isArray(array)) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA));
            }

            const data = await trashModel.addOne(array.filter(item => typeof item === 'string'));
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async restoreOne(req, res, next) {
        try {
            const {id} = req.params;
            await trashModel.restoreOne(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async restoreMany(req, res, next) {
        try {
            const {list} = req.params;

            const array = jsonValidator(list, ErrorTextList.INVALID_DATA);
            if (!Array.isArray(array)) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA));
            }

            const data = await trashModel.restoreMany(array.filter(item => typeof item === 'string'));
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async clear(req, res, next) {
        try {
            const {userId} = req.params;
            await trashModel.clear(userId);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new TrashController();