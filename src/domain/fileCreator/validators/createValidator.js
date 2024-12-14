const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');

const createValidator = [
    body('name', 'name is invalid').isLength({min: 1, max: 255}),
    idValidator('userId')
];

module.exports = createValidator;