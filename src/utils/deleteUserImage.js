const fs = require('fs');
const path = require('path');
const ApiError = require('../error/ApiError');
const ErrorTextList = require('../error/ErrorTextList');

const deleteUserImage = async (image) => {
    const imagePathArray = image.split('/');
    const imageName = imagePathArray[imagePathArray.length - 1];
    await new Promise((resolve, reject) => {
        fs.rm(path.resolve(process.env.BASE_PATH, 'images', imageName), err => {
            if (err) {
                reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
            } else {
                resolve();
            }
        });
    });
};

module.exports = deleteUserImage;