const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');
const ErrorTextList = require('../error/ErrorTextList');

const deleteUserImage = (image) => {
    const imagePathArray = image.split('/');
    const imageName = imagePathArray[imagePathArray.length - 1];
    fs.rm(path.resolve(process.env.BASE_PATH, 'images', imageName), err => {
        if (err) {
            throw ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR);
        }
    });
};

module.exports = deleteUserImage;