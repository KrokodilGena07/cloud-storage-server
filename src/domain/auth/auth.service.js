const {User, Token} = require('../../models');
const ApiError = require('../../error/ApiError');
const uuid = require('uuid');
const bcrypt = require('bcrypt');
const mailService = require('../mail/mail.service');
const tokenService = require('../tokens/token.service');
const UserDto = require('./dtos/user.dto');

class AuthService {
    link(activationLink) {
        return `${process.env.API_URL}/api/auth/activate/${activationLink}`;
    }

    async registration(username, email, password) {
        const candidate = await User.findOne({where: {email}});
        if (candidate) {
            throw ApiError.badRequest('user with this email already exists');
        }

        const id = uuid.v4();
        const activationLink = uuid.v4();
        const hashPassword = await bcrypt.hash(password, 5);

        const user = await User.create({
            id, username, password: hashPassword, email, activationLink
        });
        await mailService.sendMail(email, this.link(activationLink));

        return await this.#finishAuthorization(user);
    }

    async login(email, password) {
        if (!email || !password) {
            throw ApiError.badRequest('your data is empty');
        }

        const user = await User.findOne({where: {email}});
        if (!user) {
            throw ApiError.badRequest('user with this name wasn\'t found');
        }

        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            throw ApiError.badRequest('password is wrong');
        }

        const activationLink = uuid.v4();
        user.activationLink = activationLink;
        user.isActivated = false;

        await user.save();
        await mailService.sendMail(email, this.link(activationLink));

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
            throw ApiError.badRequest('activation link is incorrect');
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
        const tokens = tokenService.generateTokens({
            id: userDto.id, email: userDto.email
        });
        await tokenService.saveTokens(tokens.refreshToken, userDto.id);
        return {...tokens, user: userDto};
    }
}

module.exports = new AuthService();