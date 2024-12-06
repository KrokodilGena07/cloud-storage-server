const authValidator = require('../../../validators/authValidator');
const fieldValidator = require('../../../validators/fieldValidator');

const userValidator = [
    ...authValidator,
    fieldValidator('id')
];

module.exports = userValidator;