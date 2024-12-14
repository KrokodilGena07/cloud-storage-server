const {File, User, UserStorage} = require('../../models');
const ApiError = require('../../error/ApiError');
const fs = require('fs');
const ErrorTextList = require('../../error/ErrorTextList');
const {Op} = require('sequelize');
const path = require('path');

class FileDeleterModel {
    async deleteOne(id) {
        const item = await File.findByPk(id);
        if (!item) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await this.#checkUser(item.userId);

        await this.#delete(storage, item);
        await storage.save();
    }

    async deleteMany(list) {
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

        const storage = await this.#checkUser(files[0].userId);

        for (const file of files) {
            await this.#delete(storage, file);
        }

        await storage.save();
    }

    async #checkUser(id) {
        const user = await User.findByPk(id);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const storage = await UserStorage.findOne({where: {userId: user.id}});
        if (!storage) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        return storage;
    }

    async #delete(storage, file) {
        storage.usedSize = storage.usedSize - file.size;
        let options = {};

        if (file.type === 'FOLDER') {
            options = {recursive: true};
        }

        await new Promise((resolve, reject) => {
            fs.rm(file.path, options, err => {
                if (err) {
                    reject(ApiError.badRequest(ErrorTextList.UNEXPECTED_ERROR));
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
    }
}

module.exports = new FileDeleterModel();