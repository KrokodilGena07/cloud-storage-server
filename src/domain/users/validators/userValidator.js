const authValidator = require('../../../validators/authValidator');
const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');

const userValidator = [
    body('username', 'Username is invalid').optional().isLength({min: 1, max: 255}),
    body('email', 'Email is invalid').optional().isEmail(),
    body('password', 'Password is weak').optional().isStrongPassword({
        minLength: 10,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1
    }).isLength({max: 30}),
    idValidator('id')
];

module.exports = userValidator;