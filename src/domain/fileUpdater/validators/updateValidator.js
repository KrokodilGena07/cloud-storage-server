const fieldValidator = require('../../../validators/fieldValidator');

const updateValidator = [
    fieldValidator('name'),
    fieldValidator('id')
];

module.exports = updateValidator;