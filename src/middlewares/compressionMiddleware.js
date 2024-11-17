const compression = require('compression');

const compressionMiddleware = (req, res) => {
    if (req.headers['x-no-compression']) {
        return false;
    }

    return compression.filter(req, res);
};

module.exports = compressionMiddleware;