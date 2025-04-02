const authService = require('./auth.service');
const {validationResult} = require('express-validator');
const ApiError = require('../../error/api.error');

const cookieOptions = {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000
};

class AuthController {
    async registration(req, res, next) {
        try {
            const {username, email, password} = req.body;
            const errors = validationResult(req);

            if (!errors.isEmpty()) {
                return next(ApiError.badRequest('check your data', errors.array()));
            }

            const data = await authService.registration(username, email, password);
            res.cookie('refreshToken', data.refreshToken, cookieOptions);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const data = await authService.login(email, password);
            res.cookie('refreshToken', data.refreshToken, cookieOptions);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            await authService.logout(refreshToken);
            res.clearCookie('refreshToken');
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async activate(req, res, next) {
        try {
            const {link} = req.params;
            await authService.activate(link);
            res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const data = await authService.refresh(refreshToken);
            res.cookie('refreshToken', data.refreshToken, cookieOptions);
            res.json(data);
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new AuthController();