const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');

const updateValidator = [
    body('name', 'name is invalid').isLength({min: 1, max: 255}),
    idValidator('id')
];

module.exports = updateValidator;