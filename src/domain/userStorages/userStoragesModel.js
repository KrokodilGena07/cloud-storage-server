const {UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');

class UserStoragesModel {
    async get(userId) {
        const storage = await UserStorage.findOne({where: {userId}});
        if (!storage) {
            throw ApiError.badRequest('userId is invalid');
        }

        return storage;
    }
}

module.exports = new UserStoragesModel();