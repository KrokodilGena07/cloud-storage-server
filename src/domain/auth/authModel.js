const ApiError = require('../../error/ApiError');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const {User, Token} = require('../../models');
const mailModel = require('../mail/mailModel');
const UserDto = require('./dtos/UserDto');
const tokensModel = require('../tokens/tokensModel');

class AuthModel {
    link(activationLink) {
        return `${process.env.API_URL}/api/auth/activate/${activationLink}`;
    }

    async registration(username, email, password, image) {
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.badRequest('user with this email already exists');
        }

        const id = uuid.v4();
        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 5);

        const values = {
            id,
            username,
            password: hashPassword,
            email,
            activationLink
        };

        if (image) {
            values.image = image;
        }

        const user = await User.create(values);
        await mailModel.sendMail(email, this.link(activationLink));

        return await this.#finishAuthorization(user);
    }

    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest('email or password is empty');
        }

        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.badRequest('user with this email wasn\'t found');
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            throw ApiError.badRequest('password is wrong');
        }

        const activationLink = uuid.v4();
        user.activationLink = activationLink;
        await user.save();
        await mailModel.sendMail(email, this.link(activationLink));

        return await this.#finishAuthorization(user);
    }

    async logout(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized();
        }

        const token = await Token.findOne({where: {refreshToken}});
        if (!token) {
            throw ApiError.unauthorized();
        }

        const user = await User.findByPk(token.userId);
        if (!user) {
            throw ApiError.unauthorized();
        }

        user.isActivated = false;
        await user.save();
        await token.destroy();
    }

    async activate(link) {
        const user = await User.findOne({where: {activationLink: link}});
        if (!user) {
            throw ApiError.badRequest('user wasn\'t found');
        }

        user.isActivated = true;
        await user.save();
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.unauthorized();
        }

        const tokenFromDB = await Token.findOne({where: {refreshToken}});
        const userData = tokensModel.validateRefreshToken(refreshToken);
        if (!tokenFromDB  || !userData) {
            throw ApiError.unauthorized();
        }

        const user = await User.findByPk(userData.id);
        return await this.#finishAuthorization(user);
    }

    async #finishAuthorization(user) {
        const userDto = new UserDto(user);
        const tokens = tokensModel.generateTokens({
            id: userDto.id, email: userDto.email
        });
        await tokensModel.saveTokens(tokens.refreshToken, userDto.id);
        return {...tokens, user: userDto};
    }
}

module.exports = new AuthModel();