const fileDeleterModel = require('./fileDeleterModel');
const jsonValidator = require('../../validators/jsonValidator');
const ErrorTextList = require('../../error/ErrorTextList');
const ApiError = require('../../error/ApiError');

class FileDeleterController {
    async deleteOne(req, res, next) {
        try {
            const {id} = req.params;
            await fileDeleterModel.deleteOne(id);
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }

    async deleteMany(req, res, next) {
        try {
            const {list} = req.params;

            const array = jsonValidator(list, ErrorTextList.INVALID_DATA);
            if (!Array.isArray(array)) {
                return next(ApiError.badRequest(ErrorTextList.INVALID_DATA));
            }

            await fileDeleterModel.deleteMany(array.filter(item => typeof item === 'string'));
            res.json('OK');
        } catch (e) {
            next(e);
        }
    }
}

module.exports = new FileDeleterController();