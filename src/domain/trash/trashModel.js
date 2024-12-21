const {
    File,
    User,
    UserStorage
} = require('../../models');
const {Op, literal} = require('sequelize');
const ApiError = require('../../error/ApiError');
const ErrorTextList = require('../../error/ErrorTextList');
const path = require('path');
const deleteFile = require('../../utils/deleteFile');

class TrashModel {
    async get(userId) {
        return await File.findAll({
            where: {userId, isTrash: true},
            order: [
                literal('CASE WHEN type = \'FOLDER\' THEN 0 ELSE 1 END')
            ]
        });
    }

    async addOne(id) {
        return await this.#trashOperator(id, 'increment', true);
    }

    async addMany(list) {

    }

    async restoreOne(id) {
        return await this.#trashOperator(id, 'decrement', false);
    }

    async restoreMany(list) {

    }

    async clear(userId) {
        const user = await User.findByPk(file.userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const files = await File.findAll({where: {userId, isTrash: true}});

        for (const file of files) {
            await deleteFile(storage, file);
        }

        storage.trashSize = 0;
        await storage.save();
    }

    async #trashOperator(id, operation, value) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const user = await User.findByPk(file.userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        await storage[operation]('trashSize', {by: file.size});

        const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);
        await File.update(
            {isTrash: value},
            {
                where: {
                    path: {
                        [Op.like]: `${likePath}%`,
                    }
                }
            }
        );

        file.isTrash = value;
        return await file.save();
    }
}

module.exports = new TrashModel();