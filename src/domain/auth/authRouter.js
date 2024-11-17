const Router = require('express');
const authController = require('./authController');

const authRouter = new Router();

authRouter.post('/registration', authController.registration); //todo make validators
authRouter.post('/login', authController.login); //todo make validators
authRouter.post('/logout', authController.logout);
authRouter.get('/activate/:link', authController.activate);
authRouter.get('/refresh', authController.refresh);

module.exports = authRouter;