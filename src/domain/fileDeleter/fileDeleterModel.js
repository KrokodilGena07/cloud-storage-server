const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const fs = require('fs');
const ErrorTextList = require('../../error/ErrorTextList');

class FileDeleterModel {
    async deleteOne(id) {
        const item = await File.findByPk(id);
        if (!item) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const user = await User.findByPk(item.userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        storage.usedSize = storage.usedSize - item.size;
        let options = {};

        if (item.type === 'FOLDER') {
            options = {recursive: true};
        }

        fs.rm(item.path, options, err => {
            if (err) {
                throw ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR);
            }
        });

        if (item.type === 'FOLDER') {
            await File.destroy({where: {folderId: id}});
        }

        await storage.save();
        await item.destroy();
    }

    async deleteMany() {

    }
}

module.exports = new FileDeleterModel();