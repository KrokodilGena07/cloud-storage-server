const {File, User} = require('../../models');
const ApiError = require('../../error/ApiError');
const path = require('path');
const fs = require('fs');
const {Sequelize, Op} = require('sequelize');
const ErrorTextList = require('../../error/ErrorTextList');

class FileUpdaterModel {
    async rename(id, name, folderId) {
        const {where, file} = await this.#getData(id, folderId);

        const candidate = await File.findOne({where: {
            ...where, name
        }});
        if (candidate && candidate.id !== file.id) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }

        const prePath = file.path.split(path.sep);
        const newPath = path.join(...prePath.slice(0, -1), name);
        await new Promise(async (resolve, reject) => {
            await fs.rename(file.path, newPath, err => {
                if (err) {
                    reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
                } else {
                    resolve();
                }
            });
        });

        if (file.type === 'FOLDER') {
            const likePath = path.join(...prePath).replaceAll(path.sep, `${path.sep}\\`);
            await this.#updatePaths(likePath, path.join(...prePath), newPath);
        }

        file.name = name;
        file.path = newPath;

        return await file.save();
    }

    async replaceOne(id, folderId) {
        const {where, file} = await this.#getData(id, folderId);
        if (folderId) {
            where.folderId = folderId;
        }

        const candidate = await File.findOne({where: {
            ...where, name: file.name
        }});
        if (candidate) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
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

            if (parent.userId !== file.userId) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            if (parent.type !== 'FOLDER') {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }
        }

        const prePath = file.path.split(path.sep);
        const newPath = path.join(parent.path, prePath[prePath.length - 1]);
        await new Promise(async (resolve, reject) => {
            await fs.rename(file.path, newPath, err => {
                if (err) {
                    reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
                } else {
                    resolve();
                }
            });
        });

        if (file.type === 'FOLDER') {
            const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);
            await this.#updatePaths(likePath, file.path, newPath);
        }

        file.folderId = parent.id;
        file.path = newPath
        return await file.save();
    }

    async replaceMany() {

    }

    async #updatePaths(likePath, oldPath, newPath) {
        await File.update(
            {path: Sequelize.fn('REPLACE', Sequelize.col('path'), oldPath, newPath)},
            {
                where: {
                    path: {
                        [Op.like]: `${likePath}%`,
                    }
                }
            }
        );
    }

    async #getData(id, folderId) {
        const file = await File.findByPk(id);
        if (!file) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const user = await User.findByPk(file.userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const where = {folderId: null, userId: user.id};
        if (folderId) {
            where.folderId = folderId;
        }

        return {
            where, file
        };
    }
}

module.exports = new FileUpdaterModel();