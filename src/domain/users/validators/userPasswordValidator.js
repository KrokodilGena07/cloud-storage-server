const {body} = require('express-validator');
const passwordValidator = require('../../../validators/passwordValidator');

const userPasswordValidator = [
    body('id', 'id is invalid').isUUID(4),
    passwordValidator
];

module.exports = userPasswordValidator;