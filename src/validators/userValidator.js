const {body} = require('express-validator');

const userValidator = [
    body('username', 'username is invalid').isLength({min: 1, max: 255}),
    body('email', 'email is invalid').isEmail(),
];

module.exports = userValidator;