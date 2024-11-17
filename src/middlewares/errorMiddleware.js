const ApiError = require('../error/ApiError');

const errorMiddleware = (req, res, next, err) => {
    console.log(err);
    if (err instanceof ApiError) {
        return res.status(err.status).json({message: err.message, errors: err.errors});
    }
    res.status(500).json({message: 'Server Internal Error'});
};

module.exports = errorMiddleware;