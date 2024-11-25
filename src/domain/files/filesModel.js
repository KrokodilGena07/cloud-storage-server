const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');
const {Op, Sequelize} = require('sequelize');

class FilesModel {
    async getFiles(userId, folderId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('userId is invalid');
        }

        const where = {userId, folderId: null};
        if (folderId) {
            where.folderId = folderId;
        }

        // TODO ADD SORTING AND ORDERING FOLDERS AND FILES

        return await File.findAll({where});
    }

    async searchFiles(userId, search) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('userId is invalid');
        }

        // TODO ADD ORDERING FOLDERS AND FILES

        return await File.findAll({
            where: {
                userId,
                name: {
                    [Op.iLike]: `%${search}%`
                }
            }
        });
    }

    async createFolder(name, folderId, userId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('user id is invalid');
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
                throw ApiError.badRequest('folderId is invalid');
            }

            where.folderId = folderId;
            values.folderId = folderId;
            values.path = path.resolve(parent.path, name);
        }

        const candidate = await File.findOne({where});
        if (candidate) {
            throw ApiError.badRequest('folder with this name already exists');
        }

        fs.mkdir(values.path, err => {});
        return File.create(values);
    }

    async uploadFile(file, userId, folderId) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest('userId is invalid');
        }

        const storage = await UserStorage.findOne({where: {userId}});
        if (!storage) {
            throw ApiError.badRequest('userId is invalid');
        }

        let parentFolder;
        const where = {userId, name: file.name};
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
                throw ApiError.badRequest('folderId is invalid');
            }

            where.folderId = folderId;
            values.folderId = folderId;
            values.path = path.resolve(parentFolder.path, file.name);
            parentFolder.size = parentFolder.size + file.size;
        }

        const candidate = await File.findOne({where});
        if (candidate) {
            throw ApiError.badRequest('file with this name already exists');
        }

        if (storage.storageSize < storage.usedSize + file.size) {
            throw ApiError.badRequest('you storage is full');
        }

        await file.mv(values.path);
        storage.usedSize = storage.usedSize + file.size;

        if (folderId) {
            await parentFolder.save();
        }

        await storage.save();
        return File.create(values);
    }

    async renameFile(id, name, folderId) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest('file wasn\'t found');
        }

        const where = {name, folderId: null};
        if (folderId) {
            where.folderId = folderId;
        }

        const candidate = await File.findOne({where});
        if (candidate && candidate.id !== file.id) {
            throw ApiError.badRequest('file with this name already exists');
        }


        const prePath = file.path.split(path.sep);
        const newPath = path.join(...prePath.slice(0, -1), name);
        await fs.rename(file.path, newPath, err => {});

        if (file.type === 'FOLDER') {
            const likePath = path.join(...prePath).replaceAll(path.sep, `${path.sep}\\`);
            await File.update(
                {path: Sequelize.fn('REPLACE', Sequelize.col('path'), path.join(...prePath), newPath)},
                {
                    where: {
                        path: {
                            [Op.like]: `${likePath}%`,
                        }
                    }
                }
            );
        }

        file.name = name;
        file.path = newPath;

        return await file.save();
    }

    async replaceFile(id, folderId) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest('file wasn\'t found');
        }

        let parent = {
            id: null,
            path: path.join(...file.path.split(path.sep).slice(0, 4))
        };

        if (folderId) {
            parent = await File.findByPk(folderId);
            if (!parent) {
                throw ApiError.badRequest('folder wasn\'t found');
            }

            if (parent.type !== 'FOLDER') {
                throw ApiError.badRequest('folder wasn\'t found');
            }
        }

        const prePath = file.path.split(path.sep);
        const newPath = path.join(parent.path, prePath[prePath.length - 1]);
        await fs.rename(file.path, newPath, err => {});

        if (file.type === 'FOLDER') {
            const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);
            await File.update(
                {path: Sequelize.fn('REPLACE', Sequelize.col('path'), file.path, newPath)},
                {
                    where: {
                        path: {
                            [Op.like]: `${likePath}%`,
                        }
                    }
                }
            );
        }

        file.folderId = parent.id;
        file.path = newPath
        return await file.save();
    }

    async deleteFile(id) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest('file wasn\'t found');
        }

        const user = await User.findByPk(file.userId);
        if (!user) {
            throw ApiError.badRequest('data is invalid');
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest('data is invalid');
        }

        storage.usedSize = storage.usedSize - file.size;
        fs.rm(file.path, err => {});

        await storage.save();
        await file.destroy();
    }

    async deleteFolder(id) {
        const folder = await File.findByPk(id);
        if (!folder) {
            throw ApiError.badRequest('folder wasn\'t found');
        }

        const user = await User.findByPk(folder.userId);
        if (!user) {
            throw ApiError.badRequest('data is invalid');
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest('data is invalid');
        }

        storage.usedSize = storage.usedSize - folder.size;
        fs.rm(folder.path, {recursive: true}, err => {
            console.log(err);
        });

        await storage.save();
        await File.destroy({where: {folderId: id}});
        await folder.destroy();
    }
}

module.exports = new FilesModel();