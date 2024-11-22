const Router = require('express');
const authRouter = require('../domain/auth/authRouter');
const usersRouter = require('../domain/users/usersRouter');
const userImagesRouter = require('../domain/userImages/userImagesRouter');
const userStoragesRouter = require('../domain/userStorages/userStoragesRouter');
const filesRouter = require('../domain/files/filesRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/user/images', userImagesRouter);
router.use('/user/storages', userStoragesRouter);
router.use('/files', filesRouter);

module.exports = router;