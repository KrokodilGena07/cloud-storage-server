const userModel = require('./usersModel');
const {validationResult} = require('express-validator');
const ApiError = require('../../error/ApiError');
const ErrorTextList = require('../../error/ErrorTextList');

class UsersController {
    async updateUser(req, res, next) {
        try {
            const {username, email, password, id} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA, errors.array()));
            }

            const data = await userModel.updateUser(username, email, password, id);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.params;
            await userModel.deleteUser(id);
            res.clearCookie('refreshToken');
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UsersController;