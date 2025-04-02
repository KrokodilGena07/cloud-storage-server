const {body} = require('express-validator');

const authValidator = [
    body('username', 'maximum length is 255').isLength({min: 1, max: 255}),
    body('email', 'email is invalid').isEmail(),
    body('password', 'password is weak').isStrongPassword({
        minLength: 10,
        minLowercase: 2,
        minUppercase: 2,
        minNumbers: 2,
        minSymbols: 1
    })
];

module.exports = authValidator;