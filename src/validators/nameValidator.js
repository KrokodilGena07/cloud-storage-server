const {body} = require('express-validator');

const nameValidator = body('name', 'name is invalid')
    .isLength({min: 1, max: 255});

module.exports = nameValidator;