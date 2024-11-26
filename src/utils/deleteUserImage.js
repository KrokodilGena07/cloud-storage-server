const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');

const deleteUserImage = (image) => {
    const imagePathArray = image.split('/');
    const imageName = imagePathArray[imagePathArray.length - 1];
    fs.rm(path.resolve(process.env.BASE_PATH, 'images', imageName), err => {
        if (err) {
            throw ApiError.badRequest('image wasn\'t deleted');
        }
    });
};

module.exports = deleteUserImage;