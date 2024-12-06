const {body} = require('express-validator');

const fieldValidator = (field) => {
    return body(field, `${field} is invalid`).isUUID(4);
};

module.exports = fieldValidator;