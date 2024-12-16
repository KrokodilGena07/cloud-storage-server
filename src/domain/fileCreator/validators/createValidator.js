const idValidator = require('../../../validators/idValidator');
const {body} = require('express-validator');
const nameValidator = require('../../../validators/nameValidator');

const createValidator = [
    nameValidator,
    idValidator('userId')
];

module.exports = createValidator;