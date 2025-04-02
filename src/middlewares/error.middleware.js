const ApiError = require('../error/api.error');

function errorMiddleware(err, req, res) {
    console.log(err);
    if (err instanceof ApiError) {
        res.status(err.status).json({message: err.message, errors: err.errors});
    }
    res.status(500).json({message: 'Server Internal Error'});
}

module.exports = errorMiddleware;