const {
    User,
    Token,
    UserStorage
} = require('../../models');
const ApiError = require('../../error/ApiError');
const bcrypt = require('bcrypt');
const mailModel = require('../mail/mailModel');
const uuid = require('uuid');
const UserDto = require('../auth/dtos/UserDto');
const fs = require('fs');
const path = require('path');

class UsersModel {
    async updateUser(username, email, password, id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        if (email !== user.email) {
            const candidate = await User.findOne({where: {email}});
            if (candidate) {
                throw ApiError.badRequest('user with this email already exists');
            }

            const activationLink = uuid.v4();
            const link = `${process.env.API_URL}/api/auth/activate/${activationLink}`;
            await mailModel.sendMail(email, link);
            user.set({activationLink, isActivated: false});
        }

        const hashPassword = await bcrypt.hash(password, 5);
        user.set({username, email, password: hashPassword});
        const newUser = await user.save();
        return new UserDto(newUser);
    }

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        const token = await Token.findOne({where: {userId: user.id}});
        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!token || !storage) {
            throw ApiError.badRequest('delete user error');
        }

        await user.destroy();
        await token.destroy();
        await storage.destroy();

        if (user.image) {
            const img = user.image.split('/');
            const imageName = img[img.length - 1];
            fs.rm(path.resolve(process.env.BASE_PATH, 'images', imageName), err => {});
        }

        // todo delete all user data
    }
}

module.exports = new UsersModel();