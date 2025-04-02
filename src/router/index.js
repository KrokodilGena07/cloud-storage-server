const Router = require('express');
const authRouter = require('../domain/auth/auth.router');

const router = new Router();

router.use('/auth', authRouter);

module.exports = router;