const {validationResult} = require('express-validator');
const ApiError = require('../../error/ApiError');
const filesModel = require('./filesModel');

class FilesController {
    async getFiles(req, res, next) {
        try {
            const {userId, folderId} = req.query;
            const data = await filesModel.getFiles(userId, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async searchFiles(req, res, next) {
        try {
            const {userId, search} = req.query;
            const data = await filesModel.searchFiles(userId, search);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async createFolder(req, res, next) {
        try {
            const {name, folderId, userId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('create folder error', errors.array()));
            }

            const data = await filesModel.createFolder(name, folderId, userId);
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
                return next(ApiError.badRequest('upload file error', errors.array()));
            }

            if (!files?.file) {
                return next(ApiError.badRequest('file is empty'));
            }

            const data = await filesModel.uploadFile(files.file, userId, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async renameFile(req, res, next) {
        try {
            const {id, name, folderId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('data is invalid', errors.array()));
            }

            const data = await filesModel.renameFile(id, name, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async replaceFile(req, res, next) {
        try {
            const {id, folderId} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('replace file error', errors.array()));
            }

            const data = await filesModel.replaceFile(id, folderId);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteItem(req, res, next) {
        try {
            const {id} = req.params;
            await filesModel.deleteItem(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FilesController();