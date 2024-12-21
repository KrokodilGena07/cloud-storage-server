const {badRequest} = require('../error/ApiError');
const ErrorTextList = require('../error/ErrorTextList');
const fs = require('fs');
const {Op} = require('sequelize');

const deleteFile = async (storage, file) => {
    storage.usedSize = storage.usedSize - file.size;
    let options = {};

    if (file.type === 'FOLDER') {
        options = {recursive: true};
    }

    await new Promise((resolve, reject) => {
        fs.rm(file.path, options, err => {
            if (err) {
                reject(badRequest(ErrorTextList.UNEXPECTED_ERROR));
            } else {
                resolve();
            }
        });
    });

    if (file.type === 'FOLDER') {
        const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);

        await File.destroy({where: {
            path: {
                [Op.like]: `${likePath}%`,
            }
        }});
    }

    await file.destroy();
};

module.exports = deleteFile;