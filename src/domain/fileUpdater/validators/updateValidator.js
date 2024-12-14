const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');

const renameValidator = [
    body('name', 'name is invalid').isLength({min: 1, max: 255}),
    idValidator('id')
];

const replaceManyValidator = body('list', 'list is invalid').isArray();

module.exports = {
    renameValidator,
    replaceManyValidator
};