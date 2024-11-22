const {body} = require('express-validator');

const userIdValidator = body('userId', 'user id is invalid')
    .isUUID(4);

const folderValidator = [
    body('name', 'name is invalid').isLength({min: 1, max: 255}),
    userIdValidator
];

module.exports = {
    folderValidator,
    userIdValidator
};