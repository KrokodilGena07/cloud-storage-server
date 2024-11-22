const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

class FilesModel {
    async getFiles(userId, folderId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('userId is invalid');
        }

        if (!folderId) {
            return await File.findAll({where: {userId, folderId: null}});
        }

        return await File.findAll({where: {userId, folderId}});
    }

    async createFolder(name, folderId, userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('user id is invalid');
        }

        if (!folderId) {
            const candidate = await File.findOne({where: {name, userId}});
            if (candidate) {
                throw ApiError.badRequest('folder with this name already exists');
            }

            const id = uuid.v4();
            const folderPath = path.resolve(process.env.BASE_PATH, 'data', userId, name);
            fs.mkdir(folderPath, err => console.log(err));

            return File.create({
                name, type: 'FOLDER', id, userId, path: folderPath
            });
        }

        const parent = await File.findByPk(folderId);
        if (!parent) {
            throw ApiError.badRequest('folder id is invalid');
        }

        const candidate = await File.findOne({where: {name, folderId, userId}});
        if (candidate) {
            throw ApiError.badRequest('folder with this name already exists');
        }

        const folderPath = path.resolve(parent.path, name);
        const id = uuid.v4();
        fs.mkdir(folderPath, err => {});
        return File.create({
            name, type: 'FOLDER', id, userId, folderId, path: folderPath
        });
    }

    async uploadFile(file, userId, folderId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('userId is invalid');
        }

        const userStorage = await UserStorage.findOne({where: {userId}});
        if (!userStorage) {
            throw ApiError.badRequest('userId is invalid');
        }

        if (!folderId) {
            const candidate = await File.findOne({where: {userId, name: file.name}});
            if (candidate) {
                throw ApiError.badRequest('file with this name already exists');
            }

            const id = uuid.v4();
            const filePath = path.resolve(process.env.BASE_PATH, 'data', userId, file.name);
            await file.mv(filePath);

            if (userStorage.storageSize < userStorage.usedSize + file.size) {
                throw ApiError.badRequest('you storage is full')
            }

            userStorage.usedSize = userStorage.usedSize + file.size;
            await userStorage.save();
            return await File.create({
                userId,
                name: file.name,
                type: 'FILE',
                size: file.size,
                id,
                path: filePath
            });
        }

        const candidate = await File.findOne({where: {userId, name: file.name, folderId}});
        if (candidate) {
            throw ApiError.badRequest('file with this name already exists');
        }

        const parent = await File.findByPk(folderId);
        if (!parent) {
            throw ApiError.badRequest('folder id is invalid');
        }

        const id = uuid.v4();
        const filePath = path.resolve(parent.path, file.name);

        await file.mv(filePath);
        userStorage.usedSize = userStorage.usedSize + file.size;
        await userStorage.save();
        return await File.create({
            userId,
            name: file.name,
            type: 'FILE',
            size: file.size,
            id,
            path: filePath,
            folderId
        });
    }

    async deleteFile(id) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest('file wasn\'t found');
        }

        fs.rm(file.path, err => {});
        await file.destroy();
    }

    async deleteFolder(id) {
        const folder = await File.findByPk(id);
        if (!folder) {
            throw ApiError.badRequest('folder wasn\'t found');
        }

        fs.rmdir(folder.path, err => {});
        await File.destroy({where: {folderId: id}});
        await folder.destroy();
    }
}

module.exports = new FilesModel();