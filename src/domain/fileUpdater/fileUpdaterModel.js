const {File} = require('../../models');
const ApiError = require('../../error/ApiError');
const path = require('path');
const fs = require('fs');
const {Sequelize, Op} = require('sequelize');
const ErrorTextList = require('../../error/ErrorTextList');

class FileUpdaterModel {
    async rename(id, name, folderId) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const where = {name, folderId: null};
        if (folderId) {
            where.folderId = folderId;
        }

        const candidate = await File.findOne({where});
        if (candidate && candidate.id !== file.id) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }


        const prePath = file.path.split(path.sep);
        const newPath = path.join(...prePath.slice(0, -1), name);
        await fs.rename(file.path, newPath, err => {
            if (err) {
                throw ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR);
            }
        });

        if (file.type === 'FOLDER') {
            const likePath = path.join(...prePath).replaceAll(path.sep, `${path.sep}\\`);
            await File.update(
                {path: Sequelize.fn('REPLACE', Sequelize.col('path'), path.join(...prePath), newPath)},
                {
                    where: {
                        path: {
                            [Op.like]: `${likePath}%`,
                        }
                    }
                }
            );
        }

        file.name = name;
        file.path = newPath;

        return await file.save();
    }

    async replaceOne(id, folderId) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        let parent = {
            id: null,
            path: path.join(...file.path.split(path.sep).slice(0, 4))
        };

        if (folderId) {
            parent = await File.findByPk(folderId);
            if (!parent) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            if (parent.type !== 'FOLDER') {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }
        }

        const prePath = file.path.split(path.sep);
        const newPath = path.join(parent.path, prePath[prePath.length - 1]);
        await fs.rename(file.path, newPath, err => {
            if (err) {
                throw ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR);
            }
        });

        if (file.type === 'FOLDER') {
            const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);
            await File.update(
                {path: Sequelize.fn('REPLACE', Sequelize.col('path'), file.path, newPath)},
                {
                    where: {
                        path: {
                            [Op.like]: `${likePath}%`,
                        }
                    }
                }
            );
        }

        file.folderId = parent.id;
        file.path = newPath
        return await file.save();
    }

    async replaceMany() {

    }
}

module.exports = new FileUpdaterModel();