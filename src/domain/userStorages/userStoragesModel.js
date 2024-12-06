const {UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const ErrorTextList = require('../../error/ErrorTextList');

class UserStoragesModel {
    async get(userId) {
        const storage = await UserStorage.findOne({where: {userId}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        return storage;
    }
}

module.exports = new UserStoragesModel();