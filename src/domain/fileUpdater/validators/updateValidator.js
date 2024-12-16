const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');
const nameValidator = require('../../../validators/nameValidator');

const renameValidator = [
    nameValidator,
    idValidator('id')
];

const replaceManyValidator = body('list', 'list is invalid').isArray();

module.exports = {
    renameValidator,
    replaceManyValidator
};