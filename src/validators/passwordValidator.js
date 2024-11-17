const {body} = require('express-validator');

module.exports = body('password', 'please is weak').isStrongPassword({
    minLength: 10,
    minLowercase: 2,
    minUppercase: 2,
    minNumbers: 2,
    minSymbols: 1
}).isLength({max: 30});