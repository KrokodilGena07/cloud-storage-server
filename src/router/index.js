const Router = require('express');
const authRouter = require('../domain/auth/authRouter');
const usersRouter = require('../domain/users/usersRouter');
const userImagesRouter = require('../domain/userImages/userImagesRouter');
const userStoragesRouter = require('../domain/userStorages/userStoragesRouter');
const fileReaderRouter = require('../domain/fileReader/fileReaderRouter');
const fileCreatorRouter = require('../domain/fileCreator/fileCreatorRouter');
const fileUpdaterRouter = require('../domain/fileUpdater/fileUpdaterRouter');
const fileDeleterRouter = require('../domain/fileDeleter/fileDeleterRouter');

const router = new Router();

router.use('/auth', authRouter);
router.use('/users', usersRouter);
router.use('/user/images', userImagesRouter);
router.use('/user/storages', userStoragesRouter);
router.use('/file/reader', fileReaderRouter);
router.use('/file/creator', fileCreatorRouter);
router.use('/file/updater', fileUpdaterRouter);
router.use('/file/deleter', fileDeleterRouter);

module.exports = router;