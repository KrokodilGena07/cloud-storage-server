const fs = require('fs');
const path = require('path');

const deleteUserImage = (image) => {
    const imagePathArray = image.split('/');
    const imageName = imagePathArray[imagePathArray.length - 1];
    fs.rm(path.resolve(process.env.BASE_PATH, 'images', imageName), err => {});
};

module.exports = deleteUserImage;