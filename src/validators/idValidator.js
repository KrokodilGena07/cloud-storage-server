const {body} = require('express-validator');

module.exports = body('id', 'id is invalid').isUUID(4);