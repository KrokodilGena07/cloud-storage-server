const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const path = require('path');
const fs = require('fs');
const {Sequelize, Op} = require('sequelize');
const ErrorTextList = require('../../error/ErrorTextList');
const updateParents = require('../../utils/updateParents');
const db = require('../../config/db');

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
        const {
            where,
            file
        } = await this.#getData(id, folderId);

        const candidate = await File.findOne({where: {
            ...where, name: file.name
        }});
        if (candidate) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }

        const newParent = await this.#getNewParent(file, folderId);
        return await this.#replaceItem(file, newParent);
    }

    async replaceMany(list, folderId) {
        if (!list.length) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const files = await File.findAll({where: {
            id: {
                [Op.in]: list
            }
        }});

        if (!files.length) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const user = await User.findByPk(files[0].userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const where = {folderId: null, userId: user.id};
        if (folderId) {
            where.folderId = folderId;
        }

        const names = files.map(file => file.name);

        const candidates = await File.findAll({where: {
            ...where, name: {
                [Op.in]: names
            }
        }});
        if (candidates.length) {
            throw ApiError.badRequest(ErrorTextList.FILE_NAME_ERROR);
        }

        const newParent = await this.#getNewParent(files[0], folderId);

        for (const file of files) {
            await this.#replaceItem(file, newParent);
        }
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

    async #replaceItem(file, newParent) {
        const prePath = file.path.split(path.sep);
        const newPath = path.join(newParent.path, prePath[prePath.length - 1]);

        await new Promise(async (resolve, reject) => {
            await fs.rename(file.path, newPath,err => {
                if (err) {
                    reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
                } else {
                    resolve();
                }
            });
        });

        await db.transaction(async transaction => {
            await updateParents(file.folderId, file.size, 'decrement');
            await updateParents(newParent.id, file.size, 'increment');
        });

        if (file.type === 'FOLDER') {
            const likePath = file.path.replaceAll(path.sep, `${path.sep}\\`);
            await this.#updatePaths(likePath, file.path, newPath);
        }

        file.folderId = newParent.id;
        file.path = newPath;
        return await file.save();
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

    async #getNewParent(file, folderId) {
        let newParent = {
            id: null,
            path: path.join(...file.path.split(path.sep).slice(0, 4))
        };

        if (folderId) {
            newParent = await File.findByPk(folderId);
            if (!newParent) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            if (newParent.userId !== file.userId) {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }

            if (newParent.type !== 'FOLDER') {
                throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
            }
        }

        return newParent;
    }
}

module.exports = new FileUpdaterModel();