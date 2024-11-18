const Router = require('express');
const authRouter = require('../domain/auth/authRouter');
const usersRouter = require('../domain/users/usersRouter');
const userImagesRouter = require('../domain/userImages/userImagesRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/user/images', userImagesRouter);

module.exports = router;