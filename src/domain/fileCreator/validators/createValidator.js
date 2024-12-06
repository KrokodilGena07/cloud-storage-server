const fieldValidator = require('../../../validators/fieldValidator');

const createValidator = [
    fieldValidator('name'),
    fieldValidator('userId')
];

module.exports = createValidator;