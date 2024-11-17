const {User} = require('../../models');
const ApiError = require('../../error/ApiError');
const bcrypt = require('bcrypt');
const mailModel = require('../mail/mailModel');
const uuid = require('uuid');
const UserDto = require('../auth/dtos/UserDto');

class UsersModel {
    async updateUser(username, email) {
        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        if (email !== user.email) {
            const candidate = await User.findOne({where: {email}});
            if (candidate) {
                throw ApiError.badRequest('user with this email already exists');
            }

            const activationLink = uuid.v4();
            const link = `${process.env.API_URL}/auth/activate/${activationLink}`;
            await mailModel.sendMail(email, link);
            user.activationLink = activationLink;
        }

        user.set({username, email});
        const newUser = await user.save();
        return new UserDto(newUser);
    }

    async checkUserPassword(id, password) {
        if (!id || !password) {
            throw ApiError.badRequest('id or password is empty');
        }

        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        const isPassEqual = await bcrypt.compare(password, user.password);
        if (!isPassEqual) {
            throw ApiError.badRequest('password is wrong');
        }

        return true;
    }

    async updateUserPassword(id, password) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        user.password = await bcrypt.hash(password, 5);
        await user.save();
    }

    async deleteUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }
        await user.destroy();
        // todo delete all user data
    }
}

module.exports = new UsersModel();