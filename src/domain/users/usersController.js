const userModel = require('./usersModel');
const {validationResult} = require('express-validator');
const ApiError = require('../../error/ApiError');

class UsersController {
    async updateUser(req, res, next) {
        try {
            const {username, email} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('update user error', errors.array()));
            }

            const data = await userModel.updateUser(email, username);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async checkUserPassword(req, res, next) {
        try {
            const {id, password} = req.query;
            const data = await userModel.checkUserPassword(id, password);
            res.json(data); // todo check future errors
        } catch (e) {
            next(e);
        }
    }

    async updateUserPassword(req, res, next) {
        try {
            const {id, password} = req.query;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('update user password error', errors.array()));
            }

            await userModel.updateUserPassword(id, password);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async deleteUser(req, res, next) {
        try {
            const {id} = req.params;
            await userModel.deleteUser(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new UsersController;