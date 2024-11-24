const {body} = require('express-validator');

const userIdValidator = body('userId', 'user id is invalid')
    .isUUID(4);

const nameValidator = body('name', 'name is invalid')
    .isLength({min: 1, max: 255});

const folderValidator = [
    nameValidator,
    userIdValidator
];

const renameValidator = [
    nameValidator,
    body('id', 'id is invalid').isUUID(4)
];

module.exports = {
    folderValidator,
    userIdValidator,
    renameValidator
};