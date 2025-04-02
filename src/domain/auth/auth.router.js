const Router = require('express');
const authController = require('./auth.controller');
const authValidator = require('./validators/auth.validator');

const authRouter = new Router();

authRouter.post('/registration', ...authValidator, authController.registration);
authRouter.post('/login', authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);

module.exports = authRouter;