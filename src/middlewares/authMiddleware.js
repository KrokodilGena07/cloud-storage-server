const ApiError = require('../error/ApiError');
const tokenModel = require('../domain/tokens/tokensModel');

const authMiddleware = (req, res, next) => {
    try {
        const accessToken = req.headers?.authorization.split(' ')[1];
        if (!accessToken) {
            return next(ApiError.unauthorized());
        }

        const userData = tokenModel.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.unauthorized());
        }

        next();
    } catch (e) {
        next(ApiError.unauthorized());
    }
};

module.exports = authMiddleware;