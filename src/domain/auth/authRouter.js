const Router = require('express');
const authController = require('./authController');
const authValidator = require('./validators/authValidator');

const authRouter = new Router();

authRouter.post('/registration', ...authValidator, authController.registration);
authRouter.post('/login', ...authValidator, authController.login);
authRouter.post('/logout', authController.logout);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);

module.exports = authRouter;