const path = require('path');

function isImage(file) {
    if (!file) return false;

    switch (path.extname(file)) {
        case '.png': return true;
        case '.gif': return true;
        case '.jpg': return true;
        case '.jpeg': return true;
        default: return false;
    }
}

module.exports = isImage;