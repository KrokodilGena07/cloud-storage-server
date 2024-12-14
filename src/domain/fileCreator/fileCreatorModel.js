const {User, File, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const ErrorTextList = require('../../error/ErrorTextList');
const db = require('../../config/db');
const updateParents = require('../../utils/updateParents');

class FileCreatorModel {
    async createFolder(name, folderId, userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const where = {name, userId};
        const values = {
            name,
            type: 'FOLDER',
            id: uuid.v4(),
            userId,
            path: path.resolve(process.env.BASE_PATH, 'data', userId, name)
        };

        if (folderId) {
            const parent = await File.findByPk(folderId);
            if (!parent) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            where.folderId = folderId;
            values.folderId = folderId;
            values.path = path.resolve(parent.path, name);
        }

        const candidate = await File.findOne({where});
        if (candidate) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }

        await new Promise((resolve, reject) => {
            fs.mkdir(values.path, err => {
                if (err) {
                    reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
                } else {
                    resolve();
                }
            });
        });
        return File.create(values);
    }

    async uploadFile(file, userId, folderId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        let parentFolder;
        const where = {
            userId,
            name: file.name,
            folderId: null
        };

        const values = {
            userId,
            name: file.name,
            type: 'FILE',
            size: file.size,
            id: uuid.v4(),
            path: path.resolve(process.env.BASE_PATH, 'data', userId, file.name)
        };

        if (folderId) {
            parentFolder = await File.findByPk(folderId);
            if (!parentFolder) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            where.folderId = folderId;
            values.folderId = folderId;
            values.path = path.resolve(parentFolder.path, file.name);
            await db.transaction(async (transaction) => {
                await updateParents(parentFolder.id, values.size, 'increment');
            });
        }

        const candidate = await File.findOne({where});
        if (candidate) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }

        if (storage.storageSize < storage.usedSize + file.size) {
            throw ApiError.badRequest(ErrorTextList.STORAGE_SIZE_ERROR);
        }

        await file.mv(values.path);
        storage.usedSize = storage.usedSize + file.size;

        if (folderId) {
            await parentFolder.save();
        }

        await storage.save();
        return File.create(values);
    }
}

module.exports = new FileCreatorModel();