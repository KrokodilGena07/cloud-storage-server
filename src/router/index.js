const Router = require('express');
const authRouter = require('../domain/auth/authRouter');
const usersRouter = require('../domain/users/usersRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);

module.exports = router;