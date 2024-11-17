const fs = require('fs');
const {BG_GREEN, BG_YELLOW, RESET} = require('./colors');
const path = require('path');

const createBaseFolder = () => {
    fs.mkdir(process.env.BASE_PATH, err => {
        if (err) {
            console.log(BG_YELLOW, 'CLOUD_STORAGE_DATA already exists', RESET);
            return;
        }
        console.log(BG_GREEN, 'CLOUD_STORAGE_DATA has created', RESET);
    });
    fs.mkdir(path.resolve(process.env.BASE_PATH, 'images'), err => {});
    fs.mkdir(path.resolve(process.env.BASE_PATH, 'data'), err => {});
};

module.exports = createBaseFolder;