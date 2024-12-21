const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const ErrorTextList = require('../../error/ErrorTextList');
const {Op} = require('sequelize');
const deleteFile = require('../../utils/deleteFile');

class FileDeleterModel {
    async deleteOne(id) {
        const item = await File.findByPk(id);
        if (!item) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await this.#checkUser(item.userId);

        await deleteFile(storage, item);
        await storage.save();
    }

    async deleteMany(list) {
        if (!list.length) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const files = await File.findAll({where: {
            id: {
                [Op.in]: list
            }
        }});

        if (!files.length) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await this.#checkUser(files[0].userId);

        for (const file of files) {
            await deleteFile(storage, file);
        }

        await storage.save();
    }

    async #checkUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        return storage;
    }
}

module.exports = new FileDeleterModel();