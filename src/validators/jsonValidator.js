const ApiError = require('../error/ApiError');
const jsonValidator = (value, error) => {
    try {
        return JSON.parse(value);
    } catch (e) {
        throw ApiError.badRequest(error);
    }
};

module.exports = jsonValidator;