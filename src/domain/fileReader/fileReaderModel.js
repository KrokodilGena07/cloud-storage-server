const {User, File} = require('../../models');
const ApiError = require('../../error/ApiError');
const {literal, Op} = require('sequelize');
const ErrorTextList = require('../../error/ErrorTextList');

class FileReaderModel {
    async getFiles(userId, folderId, sort) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        const where = {userId, folderId: null};
        if (folderId) {
            where.folderId = folderId;
        }

        let order;

        switch (sort) {
            case 'name_up':
                order = ['name', 'ASC'];
                break;
            case 'name_down':
                order = ['name', 'DESC'];
                break;
            case 'size_up':
                order = ['size', 'ASC'];
                break;
            case 'size_down':
                order = ['size', 'DESC'];
                break;
            case 'date_up':
                order = ['date', 'ASC'];
                break;
            case 'date_down':
                order = ['date', 'DESC'];
                break;
        }

        return await File.findAll({
            where,
            order: [
                literal('CASE WHEN type = \'FOLDER\' THEN 0 ELSE 1 END'),
                order && order
            ].filter(Boolean)
        });
    }

    async searchFiles(userId, search) {
        const user = await User.findByPk(userId);
        if (!user) {
            throw ApiError.badRequest(ErrorTextList.INVALID_DATA);
        }

        return await File.findAll({
            where: {
                userId,
                name: {
                    [Op.iLike]: `%${search}%`
                }
            },
            order: [
                literal('CASE WHEN type = \'FOLDER\' THEN 0 ELSE 1 END')
            ]
        });
    }

    async download() {

    }
}

module.exports = new FileReaderModel();