const {User} = require('../../models');
const ApiError = require('../../error/ApiError');
const UserDto = require('../auth/dtos/UserDto');
const createUserImage = require('../../utils/createUserImage');
const deleteUserImage = require('../../utils/deleteUserImage');
const ErrorTextList = require('../../error/ErrorTextList');

class UserImagesModel {
    async setImage(image, id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        if (user.image) {
            await deleteUserImage(user.image);
        }
        user.image = await createUserImage(image);

        const updatedUser = await user.save();
        return new UserDto(updatedUser);
    }

    async deleteImage(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        if (!user.image) {
            throw ApiError.badRequest(ErrorTextList.USER_HAS_NO_IMAGE);
        }

        await deleteUserImage(user.image);
        user.image = null;

        const updatedUser = await user.save();
        return new UserDto(updatedUser);
    }
}

module.exports = new UserImagesModel();