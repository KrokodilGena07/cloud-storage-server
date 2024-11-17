const Router = require('express');
const authRouter = require('./authRouter');
const usersRouter = require('./usersRouter');
const activatedUsersRouter = require('./activatedUsersRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/activated/users', activatedUsersRouter);

module.exports = router;