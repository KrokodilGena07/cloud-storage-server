const {User} = require('../../models');
const ApiError = require('../../error/ApiError');
const UserDto = require('../auth/dtos/UserDto');
const createUserImage = require('../../utils/createUserImage');
const deleteUserImage = require('../../utils/deleteUserImage');

class UserImagesModel {
    async setImage(image, id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        deleteUserImage(image);
        user.image = createUserImage(image);

        const updatedUser = await user.save();
        return new UserDto(updatedUser);
    }

    async deleteImage(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        deleteUserImage(user.image);
        user.image = null;

        const updatedUser = await user.save();
        return new UserDto(updatedUser);
    }
}

module.exports = new UserImagesModel();