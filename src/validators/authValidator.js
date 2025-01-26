const {body} = require('express-validator');

const authValidator = [
    body('username', 'Username is invalid').isLength({min: 1, max: 255}),
    body('email', 'Email is invalid').isEmail(),
    body('password', 'Password is weak').isStrongPassword({
        minLength: 10,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1
    }).isLength({max: 30})
];

module.exports = authValidator;