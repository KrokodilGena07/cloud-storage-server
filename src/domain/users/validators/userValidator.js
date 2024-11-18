const authValidator = require('../../../validators/authValidator');
const {body} = require('express-validator');

const userValidator = [
    ...authValidator,
    body('id', 'id is invalid').isUUID(4)
];

module.exports = userValidator;