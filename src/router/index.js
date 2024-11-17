const Router = require('express');
const authRouter = require('../domain/auth/authRouter');
const usersRouter = require('../domain/users/usersRouter');
const activatedUsersRouter = require('../domain/activatedUsers/activatedUsersRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/activated/users', activatedUsersRouter);

module.exports = router;