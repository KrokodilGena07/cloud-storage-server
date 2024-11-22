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

    async deleteFile(req, res, next) {
        try {
            const {id} = req.params;
            await filesModel.deleteFile(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async deleteFolder(req, res, next) {
        try {
            const {id} = req.params;
            await filesModel.deleteFolder(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FilesController();