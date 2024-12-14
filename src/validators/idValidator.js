const {body} = require('express-validator');

const idValidator = (field) => {
    return body(field, `${field} is invalid`).isUUID(4);
};

module.exports = idValidator;