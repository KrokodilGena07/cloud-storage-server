const passwordValidator = require('../../../validators/passwordValidator');
const userValidator = require('../../../validators/userValidator');

const authValidator = [
    ...userValidator,
    passwordValidator
];

module.exports = authValidator;