const authValidator = require('../../../validators/authValidator');
const idValidator = require('../../../validators/idValidator');

const userValidator = [
    ...authValidator,
    idValidator('id')
];

module.exports = userValidator;