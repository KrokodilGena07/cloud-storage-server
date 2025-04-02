const jwt = require('jsonwebtoken');
const {Token} = require('../../models');
const uuid = require('uuid');

class TokenService {
    generateTokens(payload) {
        return {
            refreshToken: jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {expiresIn: '30d'}),
            accessToken: jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {expiresIn: '30m'})
        };
    }

    async saveTokens(refreshToken, userId) {
        const token = await Token.findOne({where: {userId}});
        if (!token) {
            const id = uuid.v4();
            return await Token.create({id, refreshToken, userId});
        }
        token.refreshToken = refreshToken;
        await token.save();
    }

    #validateToken(token, secretKey) {
        try {
            return jwt.verify(token, secretKey);
        } catch (e) {
            return null
        }
    }

    validateRefreshToken(token) {
        return this.#validateToken(token, process.env.REFRESH_SECRET_KEY);
    }

    validateAccessToken(token) {
        return this.#validateToken(token, process.env.ACCESS_SECRET_KEY);
    }
}

module.exports = new TokenService();